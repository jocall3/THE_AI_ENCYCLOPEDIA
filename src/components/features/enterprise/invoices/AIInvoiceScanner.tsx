import React, { useState, useCallback, useMemo } from 'react';
import { Upload, Button, message, Spin, Card, Row, Col, Typography, Input, DatePicker, Form, Popconfirm } from 'antd';
import { UploadOutlined, ScanOutlined, ScheduleOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface InvoiceData {
  invoiceNumber: string;
  vendorName: string;
  totalAmount: number;
  currency: string;
  issueDate: dayjs.Dayjs;
  dueDate: dayjs.Dayjs;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

const initialInvoiceData: InvoiceData = {
  invoiceNumber: '',
  vendorName: '',
  totalAmount: 0,
  currency: 'USD',
  issueDate: dayjs(),
  dueDate: dayjs().add(30, 'days'),
  lineItems: [],
};

const mockOcrProcessing = (file: File): Promise<InvoiceData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful OCR extraction
      resolve({
        invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        vendorName: 'Acme Solutions Inc.',
        totalAmount: 1999.50,
        currency: 'USD',
        issueDate: dayjs().subtract(10, 'days'),
        dueDate: dayjs().add(20, 'days'),
        lineItems: [
          { description: 'Consulting Services Q3', quantity: 1, unitPrice: 1500, total: 1500 },
          { description: 'Software License Fee', quantity: 5, unitPrice: 99.90, total: 499.50 },
        ],
      });
    }, 2500); // Simulate network and processing delay
  });
};

const AIInvoiceScanner: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [form] = Form.useForm();

  const handleScanInvoice = useCallback(async (file: File) => {
    setIsScanning(true);
    setExtractedData(null);
    try {
      const data = await mockOcrProcessing(file);
      setExtractedData(data);
      form.setFieldsValue({
        ...data,
        totalAmount: data.totalAmount.toFixed(2),
        issueDate: data.issueDate,
        dueDate: data.dueDate,
      });
      message.success('Invoice details successfully extracted!');
    } catch (error) {
      message.error('Failed to process invoice via OCR.');
    } finally {
      setIsScanning(false);
    }
  }, [form]);

  const uploadProps = useMemo(() => ({
    name: 'file',
    multiple: false,
    accept: '.pdf,.jpg,.png',
    fileList,
    customRequest: ({ file }: any) => {
      // Custom request handles the file upload simulation and scanning
      setFileList([file]);
      handleScanInvoice(file as File);
    },
    onRemove: () => {
      setFileList([]);
      setExtractedData(null);
      form.resetFields();
    },
    beforeUpload: (file: File) => {
      const isPdfOrImage = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!isPdfOrImage) {
        message.error('You can only upload PDF, JPG, or PNG files!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  }), [fileList, handleScanInvoice, form]);

  const handleSchedulePayment = async (values: InvoiceData) => {
    setIsScheduling(true);
    // Simulate API call to schedule payment
    console.log('Scheduling payment for:', values);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`Payment for $${values.totalAmount} to ${values.vendorName} scheduled successfully for ${dayjs(values.dueDate).format('YYYY-MM-DD')}.`);
      setExtractedData(null);
      setFileList([]);
      form.resetFields();
    } catch (error) {
      message.error('Failed to schedule payment.');
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Card 
      title={<Title level={3}><ScanOutlined /> AI Invoice Scanner & Scheduler</Title>}
      style={{ maxWidth: 1000, margin: '20px auto' }}
    >
      <Row gutter={24}>
        <Col span={10}>
          <Title level={4}>1. Upload Invoice</Title>
          <Dragger {...uploadProps} disabled={isScanning}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Click or drag PDF/Image file to this area</p>
            <p className="ant-upload-hint">
              Supports single uploads for automatic OCR processing.
            </p>
          </Dragger>
          {isScanning && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Spin indicator={<ScanOutlined spin style={{ fontSize: 24 }} />} />
              <Text type="secondary" style={{ display: 'block', marginTop: 10 }}>
                Scanning invoice and extracting data...
              </Text>
            </div>
          )}
        </Col>

        <Col span={14}>
          <Title level={4}>2. Review & Schedule Payment</Title>
          {!extractedData && !isScanning && fileList.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed #ccc' }}>
              <FileTextOutlined style={{ fontSize: 50, color: '#aaa' }} />
              <Text type="secondary" style={{ display: 'block', marginTop: 10 }}>
                Upload an invoice to begin automatic extraction.
              </Text>
            </div>
          )}

          {extractedData && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSchedulePayment}
              initialValues={extractedData}
            >
              <Card size="small" title="Extracted Invoice Details" style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Vendor Name" name="vendorName" rules={[{ required: true }]}>
                      <Input prefix={<FileTextOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Invoice Number" name="invoiceNumber" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Total Amount" name="totalAmount" rules={[{ required: true }]}>
                      <Input 
                        prefix={<DollarOutlined />} 
                        type="number" 
                        step="0.01"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Issue Date" name="issueDate" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Payment Due Date" name="dueDate" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                </Row>

                <Title level={5}>Line Items ({extractedData.lineItems.length})</Title>
                {extractedData.lineItems.map((item, index) => (
                    <Text key={index} type="secondary" style={{ display: 'block' }}>
                        - {item.description}: {item.quantity} x {item.unitPrice} = {item.total} {extractedData.currency}
                    </Text>
                ))}
              </Card>

              <Form.Item>
                <Popconfirm
                  title="Confirm Payment Scheduling"
                  description="Are you sure you want to schedule this invoice for payment?"
                  onConfirm={form.submit}
                  okText="Yes, Schedule"
                  cancelText="No"
                >
                  <Button 
                    type="primary" 
                    icon={<ScheduleOutlined />} 
                    loading={isScheduling}
                    disabled={isScanning}
                    style={{ width: '100%' }}
                  >
                    {isScheduling ? 'Scheduling...' : 'Schedule Payment'}
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default AIInvoiceScanner;