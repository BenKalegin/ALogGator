import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  EuiPageTemplate,
  EuiPageSection,
  EuiPageHeader,
  EuiTitle,
  EuiBasicTable,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiDatePicker,
  EuiSpacer,
  EuiText,
  EuiIcon,
  Pagination,
  CriteriaWithPagination,
} from '@elastic/eui';
import moment from 'moment';

interface Log {
  timestamp: string;
  message: string;
  source: string;
}

export default function Component() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<moment.Moment>(moment().subtract(1, 'day'));
  const [endDate, setEndDate] = useState<moment.Moment>(moment());
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 20,
    totalItemCount: 0,
  });

  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get<{ results: Log[] }>('https://api.sumologic.com/api/v1/logs/search', {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY_HERE',
          'Content-Type': 'application/json',
        },
        params: {
          q: searchQuery,
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
      });
      setLogs(response.data.results);
      setPagination(prevPagination => ({
        ...prevPagination,
        totalItemCount: response.data.results.length,
      }));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const columns = [
    { 
      field: 'timestamp', 
      name: 'Timestamp', 
      sortable: true,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    { field: 'message', name: 'Message' },
    { field: 'source', name: 'Source' },
  ];

  const onTableChange = ({ page }: { page?: Pagination }) => {
    if (page) {
      setPagination(page);
    }
  };

  return (
    <EuiPageTemplate>
      <EuiPageSection>
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>
              <EuiIcon type="logstashFilter" size="xl" /> ALogGator - Sumo Logic Log Viewer
            </h1>
          </EuiTitle>
        </EuiPageHeader>
        <EuiPageSection>
          <EuiText>
            <p>Search and analyze your Sumo Logic logs with ease.</p>
          </EuiText>
          <EuiSpacer />
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFieldSearch
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                onSearch={fetchLogs}
                fullWidth
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiDatePicker
                selected={startDate}
                onChange={(date: moment.Moment) => setStartDate(date)}
                startDate={startDate}
                endDate={endDate}
                showTimeSelect
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiDatePicker
                selected={endDate}
                onChange={(date: moment.Moment) => setEndDate(date)}
                startDate={startDate}
                endDate={endDate}
                showTimeSelect
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer />
          <EuiBasicTable
            items={logs as any[]}
            columns={columns}
            pagination={{
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              totalItemCount: logs.length,
            }}
            onChange={(criteria: CriteriaWithPagination<string>) => {
              if (criteria.page) {
                const { index, size } = criteria.page;
                onTableChange({ 
                  page: { 
                    pageIndex: index, 
                    pageSize: size, 
                    totalItemCount: logs.length 
                  } 
                });
              }
            }}
          />
        </EuiPageSection>
      </EuiPageSection>
    </EuiPageTemplate>
  );
}