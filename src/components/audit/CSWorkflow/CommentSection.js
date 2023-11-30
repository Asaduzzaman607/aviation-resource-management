import {
  EditOutlined,
  FileOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Form, Input, Upload, notification } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useARMFileUpload } from '../../../lib/common/ARMFileUpload';
import {getErrorMessage, getFileExtension, getFileName} from '../../../lib/common/helpers';
import { notifySuccess } from '../../../lib/common/notifications';
import API from '../../../service/Api';

const CommentSection = ({ partDetailId }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [commentId, setCommentId] = useState(null);
  const userName = useSelector((state) => state.user.username);
  const [attachmentList, setAttachmentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    handleFileInput,
    selectedFile,
    setSelectedFile,
    handleFilesUpload,
    fileProcessForEdit,
  } = useARMFileUpload();

  const messageEndRef = useRef(null);

  const getDisposals = async (partDetailId) => {
    try {
      const { data } = await API.get(
        `/procurement/comparative-statements/audit-management/disposal/${partDetailId}`
      );
      //console.log('data: ', data);
      setComments(data);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  const getSingleComment = async (id) => {
    try {
      setLoading(true);
      const { data } = await API.get(
        `/procurement/comparative-statements/audit-management/single/disposal/${id}`
      );
      setCommentId(id);

      let fileList = [];

      if (data.attachments != null) {
        fileList = fileProcessForEdit(data?.attachments);
      }
      setAttachmentList(fileList);
      setSelectedFile(fileList);
      form.setFieldValue('auditDisposal', data.auditDisposal);
      // scrolling to bottom
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      if (commentId) {
        //file uploading to s3
        const files = await handleFilesUpload('Audit', selectedFile);

        await API.put(
          `/procurement/comparative-statements/audit-management/disposal/${commentId}`,
          { ...values, attachments: files, csPartDetailId: partDetailId }
        );
        form.resetFields();
        await getDisposals(partDetailId);
        setCommentId(null);
      } else {
        //file uploading to s3
        const files = await handleFilesUpload('Audit', selectedFile);

        await API.post(
          `/procurement/comparative-statements/audit-management/disposal`,
          {
            ...values,
            attachments: files,
            submittedByName: userName,
            csPartDetailId: partDetailId,
          }
        );
        form.resetFields();
        await getDisposals(partDetailId);
      }
      notifySuccess('Commented Successfully');
      setSelectedFile([]);
      setAttachmentList([]);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
    console.log('Success:', {
      ...values,
      submittedByName: userName,
      csPartDetailId: partDetailId,
    });
  };

  useEffect(() => {
    partDetailId && getDisposals(partDetailId);
  }, [partDetailId]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <div>
        {comments.map((comment) => (
          <div key={comment.id}>
            <div
              style={{
                display: 'flex',
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <p
                style={{
                  marginLeft: '10px',
                  marginTop: '5px',
                  fontWeight: 'bold',
                }}
              >
                {comment.submittedByName}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: '45px' }}>
              <p>{comment.auditDisposal}</p>
              <EditOutlined
                style={{
                  marginLeft: '10px',
                  marginTop: '3px',
                  color: '#04aa6d',
                }}
                onClick={() => getSingleComment(comment.id)}
              />
            </div>
            {/* for attachments */}
            <div style={{ marginLeft: '35px' }}>
              {comment.attachments?.map((file, index) => (
                <p key={index}>
                  {getFileExtension(file) ? (
                    <img
                      width="30"
                      height="30"
                      src={file}
                      alt="img"
                    />
                  ) : (
                    <FileOutlined
                      style={{
                        fontSize: '25px',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  )}
                  &nbsp;
                  <a
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getFileName(file)}
                  </a>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            gap: 5,
          }}
        >
          <Avatar icon={<UserOutlined />} />
          <Form.Item
            label=""
            name="auditDisposal"
            rules={[
              {
                required: true,
                message: 'Please input Audit Disposal!',
              },
            ]}
          >
            <TextArea
              rows="5"
              showCount
              maxLength={100}
              style={{
                width: '200%',
                marginLeft: '10px',
              }}
            />
          </Form.Item>
        </div>
        <div style={{ width: '54%' }}>
          {!loading && (
            <Form.Item label="Attachments">
              <Upload.Dragger
                multiple
                onChange={handleFileInput}
                showUploadList={true}
                type="file"
                listType="picture"
                defaultFileList={[...attachmentList]}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>{' '}
                &nbsp;
              </Upload.Dragger>
            </Form.Item>
          )}
        </div>
        <div ref={messageEndRef}></div>
      </div>

      <Form.Item style={{ marginLeft: '5%', marginTop: '15px' }}>
        <Button
          type="primary"
          htmlType="submit"
        >
          Post Disposal
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentSection;
