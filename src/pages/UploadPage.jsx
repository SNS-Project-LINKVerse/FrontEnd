import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { postAPI, mediaAPI } from '../utils/api';
import './UploadPage.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [step, setStep] = useState('select');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setStep('edit');
      setUploadError('');
    } else {
      setUploadError('이미지 파일만 업로드 가능합니다.');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 업로드 함수
  const uploadFile = async (file) => {
    try {
      const response = await mediaAPI.uploadFile(file);
      if (response.success) {
        return response.data.url; // 업로드된 파일의 URL 반환
      } else {
        throw new Error(response.message || '파일 업로드에 실패했습니다.');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || '파일 업로드에 실패했습니다.');
    }
  };

  // 게시글 생성 함수
  const createPost = async (mediaUrl) => {
    try {
      const postData = {
        content: caption,
        location: null, // 필요시 위치 정보 추가
        visibility: visibility, // PUBLIC, FRIENDS, PRIVATE
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        hashtags: hashtags
      };

      const response = await postAPI.createPost(postData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  };

  const handleUpload = async () => {
    if (!caption.trim() && !selectedFile) {
      setUploadError('내용을 입력하거나 이미지를 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      let mediaUrl = null;

      // 파일이 선택된 경우 먼저 파일 업로드
      if (selectedFile) {
        mediaUrl = await uploadFile(selectedFile);
      }

      // 게시글 생성
      const result = await createPost(mediaUrl);

      console.log('업로드 완료:', { caption, hashtags, mediaUrl, result });
      setStep('complete');
    } catch (error) {
      console.error('업로드 실패:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCaption('');
    setHashtags([]);
    setHashtagInput('');
    setStep('select');
    setUploadError('');
    navigate('/home');
  };

  const handleComplete = () => {
    setSelectedFile(null);
    setCaption('');
    setHashtags([]);
    setHashtagInput('');
    setStep('select');
    setUploadError('');
    navigate('/home');
  };

  const handleHashtagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && hashtagInput.trim()) {
      e.preventDefault();
      addHashtag();
    }
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace('#', ''); // # 제거
    if (tag && !hashtags.includes(tag) && hashtags.length < 10) { // 최대 10개 제한
      setHashtags([...hashtags, tag]);
    }
    setHashtagInput('');
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  return (
    <div className="upload-page">
      <div className="upload-backdrop" onClick={handleClose}>
        <div className="upload-modal" onClick={e => e.stopPropagation()}>
          
          {/* 숨겨진 파일 input */}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          {/* 모달 헤더 */}
          <div className="upload-header">
            <h3>업로드</h3>
            <button className="upload-close-btn" onClick={handleClose}>×</button>
          </div>

          {/* 에러 메시지 */}
          {uploadError && (
            <div className="upload-error">
              {uploadError}
            </div>
          )}

          {/* 모달 내용 */}
          <div className="upload-body">
            
            {/* 1단계: 파일 선택 */}
            {step === 'select' && (
              <div className="upload-select">
                <div className="upload-icon">📷</div>
                <p>업로드할 사진을 선택하세요</p>
                <button className="upload-file-btn" onClick={handleFileButtonClick}>
                  내 컴퓨터에서 선택하기
                </button>
              </div>
            )}

            {/* 2-3단계: 이미지 편집 */}
            {step === 'edit' && (
              <div className="upload-edit">
                {selectedFile && (
                  <div className="upload-image-preview">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="미리보기"
                      className="preview-image"
                    />
                  </div>
                )}
                <div className="upload-sidebar">
                  <div className="upload-user-info">
                    <div className="user-profile">
                      <div className="user-avatar">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt="프로필" />
                        ) : (
                          <div className="default-avatar">👤</div>
                        )}
                      </div>
                      <span className="username">{user?.username || '사용자'}</span>
                    </div>
                  </div>
                  
                  <div className="upload-form">
                    <div className="upload-text-section">
                      <textarea
                        placeholder="문구를 입력하세요..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="upload-textarea"
                        maxLength={500}
                      />
                      <div className="textarea-helper">
                        텍스트 입력({caption.length}/500자)
                      </div>
                    </div>
                    
                    <div className="visibility-section">
                      <label htmlFor="visibility">공개 범위</label>
                      <select 
                        id="visibility"
                        value={visibility} 
                        onChange={(e) => setVisibility(e.target.value)}
                        className="visibility-select"
                      >
                        <option value="PUBLIC">전체 공개</option>
                        <option value="FRIENDS">친구만</option>
                        <option value="PRIVATE">나만 보기</option>
                      </select>
                    </div>
                    
                    <div className="hashtag-section">
                      <div className="hashtag-input-row">
                        <input
                          type="text"
                          className="hashtag-input"
                          placeholder="#해시태그 추가"
                          value={hashtagInput}
                          onChange={e => setHashtagInput(e.target.value)}
                          onKeyDown={handleHashtagKeyDown}
                        />
                        <button 
                          className="hashtag-add-btn" 
                          onClick={addHashtag}
                          disabled={!hashtagInput.trim() || hashtags.length >= 10}
                        >
                          추가
                        </button>
                      </div>
                      <div className="hashtag-list">
                        {hashtags.map((tag) => (
                          <span className="hashtag-item" key={tag}>
                            #{tag}
                            <button 
                              className="hashtag-remove-btn" 
                              onClick={() => removeHashtag(tag)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      {hashtags.length >= 10 && (
                        <div className="hashtag-limit">최대 10개까지 추가할 수 있습니다.</div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="upload-submit-btn" 
                    onClick={handleUpload}
                    disabled={isUploading || (!caption.trim() && !selectedFile)}
                  >
                    {isUploading ? '업로드 중...' : '업로드'}
                  </button>
                </div>
              </div>
            )}

            {/* 4단계: 업로드 완료 */}
            {step === 'complete' && (
              <div className="upload-complete">
                <h4>업로드 완료</h4>
                <p>게시글이 성공적으로 업로드되었습니다.</p>
                <button className="upload-confirm-btn" onClick={handleComplete}>
                  확인
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;