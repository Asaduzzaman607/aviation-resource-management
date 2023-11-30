import { FileOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, notification } from 'antd';
import { useEffect, useState } from 'react';
import {getErrorMessage, getFileExtension, getFileName} from '../../../lib/common/helpers';
import CSService from '../../../service/procurment/CSService';

const CommentsList = ({ csID, partDetailId }) => {
  const [comments, setComments] = useState([]);

  const getDisposals = async (id) => {
    try {
      const { data } = await CSService.getDisposals(id);
      setComments(data);
    } catch (error) {
      notification['error']({ message: getErrorMessage(error) });
    }
  };

  useEffect(() => {
    partDetailId && getDisposals(partDetailId);
  }, [partDetailId]);

  return (
    <div>
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
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
                  fontWeight: 'bold',
                  marginTop: '5px',
                }}
              >
                {comment.submittedByName}
              </p>
            </div>
            <div style={{ display: 'flex', marginLeft: '45px' }}>
              <p>{comment.auditDisposal}</p>
            </div>
            {/* for attachments */}
            <div style={{ marginLeft: '35px' }}>
              {comment.attachments?.map((file, index) => (
                <p key={index}>
                  {getFileExtension(file) ? (
                    <img
                      alt="img"
                      width="30"
                      height="30"
                      src={file}
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
        ))
      )}
    </div>
  );
};

export default CommentsList;
