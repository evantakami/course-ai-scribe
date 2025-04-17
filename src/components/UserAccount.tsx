
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserCircle, Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserAccountProps {
  onUsernameChange?: (username: string) => void;
}

interface UserProfile {
  username: string;
  email?: string;
  quizStats: {
    totalQuizzes: number;
    correctAnswers: number;
    totalQuestions: number;
  };
  categories: string[];
}

interface FormValues {
  username: string;
  email: string;
}

const UserAccount = ({ onUsernameChange }: UserAccountProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "学习者",
    email: "",
    quizStats: {
      totalQuizzes: 0,
      correctAnswers: 0,
      totalQuestions: 0
    },
    categories: []
  });

  const form = useForm<FormValues>({
    defaultValues: {
      username: userProfile.username,
      email: userProfile.email || "",
    },
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    form.setValue("username", userProfile.username);
    form.setValue("email", userProfile.email || "");
  }, [userProfile, form]);

  const loadUserProfile = () => {
    try {
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } else {
        // Initialize quiz stats from history
        calculateQuizStats();
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const calculateQuizStats = () => {
    try {
      const historyString = localStorage.getItem('content_history') || '[]';
      const history = JSON.parse(historyString);
      
      let totalQuizzes = 0;
      let correctAnswers = 0;
      let totalQuestions = 0;
      const categories = new Set<string>();
      
      history.forEach(item => {
        if (item.userAnswers && item.userAnswers.length) {
          totalQuizzes++;
          
          // Count correct answers
          item.userAnswers.forEach(answer => {
            if (answer.isCorrect) {
              correctAnswers++;
            }
            totalQuestions++;
          });
          
          // Extract category (first line or title)
          if (item.title) {
            categories.add(item.title.split(' - ')[0]);
          }
        }
      });
      
      const updatedProfile = {
        ...userProfile,
        quizStats: {
          totalQuizzes,
          correctAnswers,
          totalQuestions
        },
        categories: Array.from(categories)
      };
      
      setUserProfile(updatedProfile);
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Failed to calculate quiz stats:", error);
    }
  };
  
  const handleSaveProfile = (data: FormValues) => {
    try {
      const updatedProfile = {
        ...userProfile,
        username: data.username,
        email: data.email
      };
      
      localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      
      if (onUsernameChange) {
        onUsernameChange(data.username);
      }
      
      toast.success("个人资料已更新");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save user profile:", error);
      toast.error("保存个人资料失败");
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <UserCircle className="h-5 w-5" />
            {userProfile.username || "学习者"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              账号管理
            </DialogTitle>
            <DialogDescription>
              管理您的个人信息和查看学习数据
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input placeholder="输入您的用户名" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>电子邮箱（可选）</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="例如: user@example.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    保存个人资料
                  </Button>
                </DialogFooter>
              </form>
            </Form>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">学习统计</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">已完成测验</TableCell>
                      <TableCell className="text-right">{userProfile.quizStats.totalQuizzes}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">答题准确率</TableCell>
                      <TableCell className="text-right">
                        {userProfile.quizStats.totalQuestions > 0
                          ? Math.round((userProfile.quizStats.correctAnswers / userProfile.quizStats.totalQuestions) * 100)
                          : 0}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">总题数</TableCell>
                      <TableCell className="text-right">{userProfile.quizStats.totalQuestions}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div>
              <h4 className="text-sm font-medium mb-2">学习分类</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.categories.length > 0 ? (
                  userProfile.categories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">暂无分类数据</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAccount;
