
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import MistakeCollection from '@/components/MistakeCollection';

interface RevisionCenterProps {
  initialContent?: any;
  activeTab?: string;
}

const RevisionCenter = ({ initialContent, activeTab }: RevisionCenterProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Process initialContent if available
    if (initialContent) {
      console.log("Revision center received initial content:", initialContent);
    }
  }, [initialContent]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">复盘中心</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <MistakeCollection />
        </CardContent>
      </Card>
    </div>
  );
};

export default RevisionCenter;
