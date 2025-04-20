
import { FC } from 'react';
import RevisionCenter from './RevisionCenter';
import { PageProps } from '../types/componentProps';

const RevisionCenterWrapper: FC<PageProps> = ({ initialContent, activeTab }) => {
  return <RevisionCenter />;
};

export default RevisionCenterWrapper;
