import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Upload, Button, message, Spin, Card, Row, Col, Typography, Input, DatePicker, Form, Popconfirm, Divider, Select, Table, Tag, Modal, Alert } from 'antd';
import { UploadOutlined, ScanOutlined, ScheduleOutlined, DollarOutlined, FileTextOutlined, CodeOutlined, CheckCircleOutlined, WarningOutlined, UserOutlined, BankOutlined, CalendarOutlined, CalculatorOutlined, DatabaseOutlined, RobotOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

// --- Core Data Structures ---

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  aiValidationStatus: 'Pending' | 'Validated' | 'Flagged';
  aiConfidenceScore: number;
}

interface InvoiceData {
  transactionId: string;
  invoiceNumber: string;
  vendorName: string;
  vendorId: string; // New: Linking to Enterprise Vendor Master Data
  totalAmount: number;
  currency: string;
  issueDate: dayjs.Dayjs;
  dueDate: dayjs.Dayjs;
  paymentTerms: string; // New: e.g., Net 30, EOM
  lineItems: LineItem[];
  aiExtractionTimestamp: string;
  aiValidationSummary: {
    totalConfidence: number;
    flagsRaised: number;
    processingTimeMs: number;
  };
}

// --- State Management & Mock Services ---

const initialInvoiceData: InvoiceData = {
  transactionId: uuidv4(),
  invoiceNumber: '',
  vendorName: '',
  vendorId: '',
  totalAmount: 0,
  currency: 'USD',
  issueDate: dayjs(),
  dueDate: dayjs().add(30, 'days'),
  paymentTerms: 'Net 30',
  lineItems: [],
  aiExtractionTimestamp: '',
  aiValidationSummary: { totalConfidence: 0, flagsRaised: 0, processingTimeMs: 0 },
};

/**
 * Mock AI OCR Processing Engine
 */
const mockAIExtractionPipeline = (file: File): Promise<Omit<InvoiceData, 'transactionId' | 'aiExtractionTimestamp' | 'aiValidationSummary'>> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    setTimeout(() => {
      const simulatedData = {
        invoiceNumber: `INV-${Math.floor(Math.random() * 900000) + 100000}`,
        vendorName: 'Quantum Dynamics Corp.',
        vendorId: 'VNDR-987654',
        totalAmount: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
        currency: Math.random() > 0.8 ? 'EUR' : 'USD',
        issueDate: dayjs().subtract(Math.floor(Math.random() * 60), 'days'),
        dueDate: dayjs().add(Math.floor(Math.random() * 90) + 15, 'days'),
        paymentTerms: ['Net 15', 'Net 30', 'Net 60'][Math.floor(Math.random() * 3)],
        lineItems: [
          { id: uuidv4(), description: 'Advanced Quantum Entanglement Module', quantity: 1, unitPrice: 2500.00, total: 2500.00, aiValidationStatus: 'Pending', aiConfidenceScore: 0.99 },
          { id: uuidv4(), description: 'Hyper-Dimensional Consulting Hours', quantity: 15.5, unitPrice: 150.00, total: 2325.00, aiValidationStatus: 'Pending', aiConfidenceScore: 0.95 },
          { id: uuidv4(), description: 'Logistics & Secure Transport Fee', quantity: 1, unitPrice: 150.50, total: 150.50, aiValidationStatus: 'Pending', aiConfidenceScore: 0.88 },
        ],
      };
      
      // Simulate AI Validation Layer
      const validationSummary = {
        processingTimeMs: Date.now() - startTime,
        totalConfidence: 0,
        flagsRaised: 0,
      };

      const validatedLineItems: LineItem[] = simulatedData.lineItems.map(item => {
        let status: LineItem['aiValidationStatus'] = 'Validated';
        let confidence = item.aiConfidenceScore;
        
        // Simulate AI flagging based on thresholds or anomalies
        if (item.unitPrice > 1000 || item.description.includes('Consulting')) {
          status = 'Flagged';
          confidence *= 0.90; // Lower confidence due to subjective nature
          validationSummary.flagsRaised++;
        } else if (confidence < 0.90) {
          status = 'Flagged';
          validationSummary.flagsRaised++;
        }
        
        return { ...item, aiValidationStatus: status, aiConfidenceScore: parseFloat(confidence.toFixed(3)) };
      });
      
      // Calculate overall confidence (simple average of validated items)
      validationSummary.totalConfidence = parseFloat((validatedLineItems.reduce((sum, item) => sum + item.aiConfidenceScore, 0) / validatedLineItems.length).toFixed(3));
      
      if (validationSummary.totalConfidence < 0.90) {
          message.warn(`AI Validation Alert: Overall confidence score is low (${validationSummary.totalConfidence}). Review flagged items.`);
      }

      resolve({
        ...simulatedData,
        lineItems: validatedLineItems,
        aiValidationSummary: validationSummary,
        aiExtractionTimestamp: dayjs().toISOString(),
      });
    }, 3000);
  });
};

// --- Component Definitions ---

const LineItemTable: React.FC<{ lineItems: LineItem[], currency: string, isScheduling: boolean }> = ({ lineItems, currency, isScheduling }) => {
    const columns = useMemo(() => [
        {
            title: 'Status',
            dataIndex: 'aiValidationStatus',
            key: 'status',
            width: 100,
            render: (status: LineItem['aiValidationStatus']) => {
                if (status === 'Validated') {
                    return <Tag color="green"><CheckCircleOutlined /> Verified</Tag>;
                }
                if (status === 'Flagged') {
                    return <Tag color="red"><WarningOutlined /> Flagged</Tag>;
                }
                return <Tag color="blue"><RobotOutlined /> Pending</Tag>;
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right' as const,
            width: 80,
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            align: 'right' as const,
            render: (price: number) => `${currency} ${price.toFixed(2)}`
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            align: 'right' as const,
            render: (total: number) => <Text strong>{currency} {total.toFixed(2)}</Text>
        },
        {
            title: 'AI Confidence',
            dataIndex: 'aiConfidenceScore',
            key: 'confidence',
            align: 'center' as const,
            render: (score: number) => <Tag color={score > 0.95 ? 'blue' : score > 0.85 ? 'orange' : 'red'}>{(score * 100).toFixed(1)}%</Tag>
        }
    ], [currency]);

    return (
        <Card size="small" title={<><CalculatorOutlined /> Verified Line Items ({lineItems.length})</>} style={{ marginBottom: 20 }}>
            <Table
                dataSource={lineItems}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
                loading={isScheduling}
            />
        </Card>
    );
};


const AIInvoiceScanner: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [form] = Form.useForm();

  // --- Handlers ---

  const handleScanInvoice = useCallback(async (file: File) => {
    setIsScanning(true);
    setExtractedData(null);
    message.loading({ content: 'Initiating AI Extraction...', key: 'ocr_load', duration: 0 });
    
    try {
      const rawData = await mockAIExtractionPipeline(file);
      
      const finalData: InvoiceData = {
        ...rawData,
        transactionId: uuidv4(),
        issueDate: rawData.issueDate,
        dueDate: rawData.dueDate,
        aiExtractionTimestamp: dayjs().toISOString(),
      };

      setExtractedData(finalData);
      
      // Populate Form with AI-extracted, validated data
      form.setFieldsValue({
        vendorName: finalData.vendorName,
        vendorId: finalData.vendorId,
        invoiceNumber: finalData.invoiceNumber,
        totalAmount: finalData.totalAmount.toFixed(2),
        currency: finalData.currency,
        issueDate: finalData.issueDate,
        dueDate: finalData.dueDate,
        paymentTerms: finalData.paymentTerms,
      });
      
      message.success({ content: `Extraction Complete. Confidence: ${(finalData.aiValidationSummary.totalConfidence * 100).toFixed(1)}%.`, key: 'ocr_load', duration: 3 });
    } catch (error) {
      console.error("AI Extraction Error:", error);
      message.error({ content: 'Error in AI Extraction Layer. Please check logs.', key: 'ocr_load', duration: 5 });
    } finally {
      setIsScanning(false);
    }
  }, [form]);

  const handleSchedulePayment = async (values: any) => {
    if (!extractedData) return;

    setIsScheduling(true);
    message.loading({ content: 'Processing Payment...', key: 'schedule_load', duration: 0 });

    // Reconstruct final data object
    const finalScheduledData: InvoiceData = {
        ...extractedData,
        vendorName: values.vendorName,
        invoiceNumber: values.invoiceNumber,
        totalAmount: parseFloat(values.totalAmount),
        issueDate: dayjs(values.issueDate),
        dueDate: dayjs(values.dueDate),
        paymentTerms: values.paymentTerms,
    };

    console.log('Scheduling payment for:', finalScheduledData);
    
    try {
      // Simulate secure ledger commitment and payment initiation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success({ 
        content: `Transaction ${finalScheduledData.transactionId.substring(0, 8)}: Payment of ${finalScheduledData.currency} ${finalScheduledData.totalAmount.toFixed(2)} to ${finalScheduledData.vendorName} scheduled for ${dayjs(finalScheduledData.dueDate).format('YYYY-MM-DD')}.`, 
        key: 'schedule_load', 
        duration: 5 
      });
      
      // Reset state upon successful commitment
      setExtractedData(null);
      setFileList([]);
      form.resetFields();
    } catch (error) {
      message.error({ content: 'Payment Commitment Failed: Ledger synchronization error.', key: 'schedule_load', duration: 5 });
    } finally {
      setIsScheduling(false);
    }
  };

  // --- Upload Props Configuration ---
  const uploadProps = useMemo(() => ({
    name: 'file',
    multiple: false,
    accept: '.pdf,.jpg,.png,.tiff',
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
      message.info('Invoice data cleared.');
    },
    beforeUpload: (file: File) => {
      const isSupported = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!isSupported) {
        message.error('Unsupported File Type. Only PDF, JPG, PNG, or TIFF are permitted.');
        return Upload.LIST_IGNORE;
      }
      if (file.size > 10485760) { // 10MB limit for initial processing
        message.error('File size exceeds the 10MB limit.');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
  }), [fileList, handleScanInvoice, form]);

  // --- Render Logic ---

  const renderExtractionForm = () => {
    if (!extractedData) {
        return (
            <div style={{ padding: 40, textAlign: 'center', border: '2px dashed #4090ff', borderRadius: 8, backgroundColor: '#f0f8ff' }}>
                <DatabaseOutlined style={{ fontSize: 60, color: '#1890ff' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 10, fontSize: '1.1em' }}>
                    Awaiting File Upload... Upload a document to initiate AI-driven financial reconciliation.
                </Text>
            </div>
        );
    }

    const isDataFlagged = extractedData.aiValidationSummary.flagsRaised > 0;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSchedulePayment}
            initialValues={{
                vendorName: extractedData.vendorName,
                vendorId: extractedData.vendorId,
                invoiceNumber: extractedData.invoiceNumber,
                totalAmount: extractedData.totalAmount.toFixed(2),
                currency: extractedData.currency,
                issueDate: extractedData.issueDate,
                dueDate: extractedData.dueDate,
                paymentTerms: extractedData.paymentTerms,
            }}
        >
            <Alert
                message={isDataFlagged ? "Review Required" : "Data Integrity Confirmed"}
                description={
                    isDataFlagged 
                    ? `The AI flagged ${extractedData.aiValidationSummary.flagsRaised} item(s) for manual verification. Overall Confidence: ${(extractedData.aiValidationSummary.totalConfidence * 100).toFixed(1)}%.`
                    : `AI extraction achieved ${extractedData.aiValidationSummary.totalConfidence * 100}% confidence. Ready for commitment.`
                }
                type={isDataFlagged ? "warning" : "success"}
                showIcon
                icon={isDataFlagged ? <WarningOutlined /> : <CheckCircleOutlined />}
                style={{ marginBottom: 20 }}
            />

            <Card size="small" title={<><FileTextOutlined /> Core Transaction Metadata</>} style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Vendor Name (Master Data Link)" name="vendorName" rules={[{ required: true, message: 'Vendor Name is mandatory.' }]}>
                            <Input prefix={<UserOutlined />} disabled={isScheduling} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Vendor ID (System Reference)" name="vendorId" rules={[{ required: true }]}>
                            <Input prefix={<BankOutlined />} disabled={true} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Invoice Number (Source ID)" name="invoiceNumber" rules={[{ required: true, message: 'Invoice Number is mandatory.' }]}>
                            <Input prefix={<CodeOutlined />} disabled={isScheduling} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Issue Date" name="issueDate" rules={[{ required: true, message: 'Issue Date required.' }]}>
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled={isScheduling} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Payment Due Date" name="dueDate" rules={[{ required: true, message: 'Due Date required.' }]}>
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabled={isScheduling} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Total Amount" name="totalAmount" rules={[{ required: true }, { pattern: /^\d+(\.\d{1,2})?$/, message: 'Invalid monetary format.' }]}>
                            <Input 
                                prefix={<DollarOutlined />} 
                                type="number" 
                                step="0.01"
                                min={0}
                                disabled={isScheduling}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
                            <Select disabled={isScheduling}>
                                <Option value="USD">USD - US Dollar</Option>
                                <Option value="EUR">EUR - Euro</Option>
                                <Option value="GBP">GBP - British Pound</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Payment Terms" name="paymentTerms" rules={[{ required: true }]}>
                            <Select disabled={isScheduling}>
                                <Option value="Net 15">Net 15</Option>
                                <Option value="Net 30">Net 30</Option>
                                <Option value="Net 60">Net 60</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <LineItemTable 
                lineItems={extractedData.lineItems} 
                currency={extractedData.currency} 
                isScheduling={isScheduling}
            />

            <Form.Item>
                <Popconfirm
                    title="Confirm Payment"
                    description={
                        <Paragraph>
                            By confirming, you authorize the system to commit this transaction to the ledger. 
                            Review all flagged items before proceeding. Total: <Text strong>{extractedData.currency} {extractedData.totalAmount.toFixed(2)}</Text>.
                        </Paragraph>
                    }
                    onConfirm={form.submit}
                    okText="Commit Payment"
                    cancelText="Review Later"
                    disabled={isScheduling}
                >
                    <Button 
                        type="primary" 
                        icon={<ScheduleOutlined />} 
                        loading={isScheduling}
                        disabled={isScanning || isScheduling}
                        style={{ width: '100%', height: 50, fontSize: '1.1em' }}
                    >
                        {isScheduling ? 'Executing Ledger Commit...' : 'Finalize & Schedule Payment'}
                    </Button>
                </Popconfirm>
            </Form.Item>
        </Form>
    );
  };


  return (
    <Card 
      title={<Title level={3}><ScanOutlined /> AI Invoice Ingestion & Reconciliation</Title>}
      style={{ maxWidth: 1200, margin: '30px auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <Row gutter={32}>
        <Col span={10}>
          <Card size="small" title={<Title level={4}><UploadOutlined /> Ingestion Portal</Title>} style={{ minHeight: 350 }}>
            
            {fileList.length === 0 && !isScanning && (
                <Dragger {...uploadProps} disabled={isScanning || isScheduling}>
                    <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: 48 }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '1.1em' }}>Drag & Drop Invoice File (PDF/Image)</p>
                    <p className="ant-upload-hint">
                    Maximum 10MB. Initiates multi-stage AI OCR and validation sequence.
                    </p>
                </Dragger>
            )}

            {(isScanning || fileList.length > 0) && (
                <div style={{ textAlign: 'center', padding: 20, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    {isScanning ? (
                        <>
                            <Spin indicator={<RobotOutlined spin style={{ fontSize: 36, color: '#1890ff' }} />} size="large" />
                            <Text type="secondary" style={{ display: 'block', marginTop: 15, fontSize: '1.1em' }}>
                                AI Core Processing: Analyzing structure, cross-referencing vendor ontology, and validating line item integrity...
                            </Text>
                            <Text type="secondary" style={{ display: 'block', marginTop: 5 }}>
                                Estimated time remaining: ~{3000 / 1000} seconds. Do not close.
                            </Text>
                        </>
                    ) : (
                        <>
                            <Tag color="blue" style={{ fontSize: '1em' }}>File Ingested: {fileList[0]?.name || 'Unknown File'}</Tag>
                            <Button 
                                onClick={() => uploadProps.onRemove()} 
                                danger 
                                style={{ marginTop: 15 }}
                                disabled={isScheduling}
                            >
                                Clear & Re-Ingest
                            </Button>
                        </>
                    )}
                </div>
            )}
            
            <Divider orientation="left" plain>
                <Text strong>System Status</Text>
            </Divider>
            <Row gutter={8}>
                <Col span={12}><Text type="secondary">Vendor Match:</Text></Col>
                <Col span={12}><Tag color={extractedData ? 'green' : 'default'}>{extractedData ? extractedData.vendorId : 'N/A'}</Tag></Col>
                <Col span={12}><Text type="secondary">Extraction Time:</Text></Col>
                <Col span={12}><Tag color="default">{extractedData ? `${extractedData.aiValidationSummary.processingTimeMs}ms` : 'N/A'}</Tag></Col>
            </Row>

          </Card>
        </Col>

        <Col span={14}>
          <Card size="small" title={<Title level={4}><CalendarOutlined /> Data Review & Commitment</Title>} style={{ minHeight: 350 }}>
            {renderExtractionForm()}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AIInvoiceScanner;