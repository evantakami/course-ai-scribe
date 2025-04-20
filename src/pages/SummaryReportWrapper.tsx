
import { FC } from 'react';
import SummaryReport from './SummaryReport';
import { PageProps } from '../types/componentProps';

const SummaryReportWrapper: FC<PageProps> = ({ initialContent, activeTab }) => {
  return <SummaryReport />;
};

export default SummaryReportWrapper;
