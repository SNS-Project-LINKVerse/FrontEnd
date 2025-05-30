import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { postAPI, likeAPI, commentAPI, mediaAPI, bookmarkAPI, followAPI } from '../utils/api';
import './MainContent.css';

const stories = [
  { id: 1, name: 'My Story', isMe: true, image: 'https://picsum.photos/300/500?random=1' },
  { id: 2, name: 'knu_cse', image: 'https://picsum.photos/300/500?random=2' },
  { id: 3, name: '7o78_8', image: 'https://picsum.photos/300/500?random=3' },
  { id: 4, name: 'j._.cogml', image: 'https://picsum.photos/300/500?random=4' },
  { id: 5, name: 'aojejfingc', image: 'https://picsum.photos/300/500?random=5' },
  { id: 6, name: 'edcqazwsxr', image: 'https://picsum.photos/300/500?random=6' },
  { id: 7, name: 'knuofficial', image: 'https://picsum.photos/300/500?random=7' },
];

const StoryModal = ({ isOpen, onClose, story }) => {
  if (!isOpen || !story) return null;

  return (
    <div className="story-modal-backdrop" onClick={onClose}>
      <div className="story-modal-content" onClick={e => e.stopPropagation()}>
        <div className="story-header">
          <div className="story-user-info">
            <div className="story-profile-img"></div>
            <span className="story-username">{story.name}</span>
          </div>
          <button className="story-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="story-image-container">
          <img src={story.image} alt={`${story.name} story`} className="story-image" />
        </div>
        <div className="story-progress-bar">
          <div className="story-progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

const MainContent = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('recommend');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // UI 상태
  const [showComment, setShowComment] = useState({});
  const [showMore, setShowMore] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [comments, setComments] = useState({});
  const [storyModal, setStoryModal] = useState({ isOpen: false, story: null });
  const [followingUsers, setFollowingUsers] = useState([]);

  // 팔로잉 사용자 목록 로드
  const loadFollowingUsers = async () => {
    try {
      if (!user?.id) return;
      
      const response = await followAPI.getFollowing(user.id, 0, 100); // 최대 100명
      if (response.success && response.data) {
        setFollowingUsers(response.data);
        return response.data;
      }
      return [];
    } catch (err) {
      console.error('Failed to load following users:', err);
      return [];
    }
  };

  // 게시글 로드
  const loadPosts = async (pageNum = 0, reset = false) => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (tab === 'recommend') {
        // Recommend 탭: 모든 사용자의 공개 게시글
        response = await postAPI.getFeedPosts(pageNum, 10);
      } else {
        // Following 탭: 백엔드 API 사용 (기존 방식 대신)
        response = await postAPI.getFollowingFeedPosts(pageNum, 10);
      }

      if (response.success && response.data) {
        const newPosts = response.data;
        
        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        setHasMore(newPosts.length === 10);
        
        // 댓글 초기화
        const commentState = {};
        newPosts.forEach(post => {
          if (!comments[post.id]) {
            commentState[post.id] = [];
            loadComments(post.id);
          }
        });
        if (Object.keys(commentState).length > 0) {
          setComments(prev => ({ ...prev, ...commentState }));
        }
      } else {
        setError(response.message || '게시글을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 댓글 로드
  const loadComments = async (postId) => {
    try {
      const response = await commentAPI.getPostComments(postId, 0, 5);
      if (response.success && response.data) {
        setComments(prev => ({
          ...prev,
          [postId]: response.data
        }));
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  // 탭 변경 효과
  useEffect(() => {
    if (user) {
      setPage(0);
      setPosts([]);
      setShowComment({});
      setShowMore({});
      setHasMore(true);
      loadPosts(0, true);
    }
  }, [tab, user]);

  // 좋아요 토글
  const handleLike = async (postId) => {
    try {
      const response = await likeAPI.toggleLike('POST', postId);
      
      // UI 업데이트
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // 댓글창 토글
  const handleShowComment = (postId) => {
    setShowComment(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // 더보기 토글
  const handleShowMore = (postId) => {
    setShowMore(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // 댓글 입력
  const handleCommentChange = (postId, value) => {
    setCommentInput(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  // 댓글 등록
  const handleAddComment = async (postId) => {
    const input = commentInput[postId];
    if (!input?.trim()) return;

    try {
      const commentData = {
        postId,
        parentId: null,
        content: input.trim()
      };

      const response = await commentAPI.createComment(commentData);
      if (response.success) {
        // 댓글 목록 업데이트
        setComments(prev => ({
          ...prev,
          [postId]: [response.data, ...(prev[postId] || [])]
        }));
        
        // 게시글의 댓글 수 업데이트
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, commentsCount: post.commentsCount + 1 };
          }
          return post;
        }));
        
        // 입력창 초기화
        setCommentInput(prev => ({
          ...prev,
          [postId]: ''
        }));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await commentAPI.deleteComment(commentId);
      if (response.success) {
        // 댓글 목록에서 제거
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId].filter(comment => comment.id !== commentId)
        }));
        
        // 게시글의 댓글 수 업데이트
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, commentsCount: Math.max(0, post.commentsCount - 1) };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 북마크 토글
  const handleBookmark = async (postId) => {
    try {
      const response = await bookmarkAPI.toggleBookmark(postId);
      
      // UI 업데이트
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  // 공유 기능
  const handleShare = (post) => {
    const text = `[LinkVerse] ${post.user?.username || '사용자'} - ${post.content}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('게시글 정보가 클립보드에 복사되었습니다!');
      });
    } else {
      window.prompt('아래 내용을 복사하세요', text);
    }
  };

  // 신고 기능
  const handleReport = () => {
    alert('신고가 접수되었습니다!');
  };

  // 스토리 관련
  const handleStoryClick = (story) => {
    setStoryModal({ isOpen: true, story });
  };

  const closeStoryModal = () => {
    setStoryModal({ isOpen: false, story: null });
  };

  // 더 많은 게시글 로드
  const loadMorePosts = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage, false);
    }
  };

  // 이미지 URL 처리
  const getImageUrl = (media) => {
    if (!media || media.length === 0) return null;
    const imageMedia = media.find(m => m.mediaType === 'IMAGE');
    return imageMedia ? imageMedia.url : null;
  };

  // 스크롤 이벤트 처리 (무한 스크롤)
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      loadMorePosts();
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* 스토리 */}
      <div className="story-bar">
        {stories.map((story) => (
          <div 
            className={`story-circle${story.isMe ? ' my-story' : ''}`} 
            key={story.id}
            onClick={() => handleStoryClick(story)}
            style={{ cursor: 'pointer' }}
          >
            <div className="story-img" />
            <div className="story-name">{story.name}</div>
          </div>
        ))}
      </div>
      
      {/* 탭 */}
      <div className="tab-bar">
        <button
          className={`tab${tab === 'recommend' ? ' active' : ''}`}
          onClick={() => setTab('recommend')}
        >
          Recommend
        </button>
        <button
          className={`tab${tab === 'following' ? ' active' : ''}`}
          onClick={() => setTab('following')}
        >
          Following
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{ color: '#c62828', textAlign: 'center', margin: '20px 0' }}>
          {error}
        </div>
      )}
      
      {/* 게시글 스크롤 영역 */}
      <div className="posts-scroll-area" onScroll={handleScroll}>
        {posts.map((post) => {
          const imageUrl = getImageUrl(post.media);
          
          return (
            <div className="post-card" key={post.id}>
              <div className="post-header">
                <span className="likes">
                  좋아요 {post.likesCount || 0}
                </span>
                <div className="post-actions">
                  <button
                    className={`icon-btn like-btn${post.isLiked ? ' liked' : ''}`}
                    title="좋아요"
                    onClick={() => handleLike(post.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={post.isLiked ? "#ff6b81" : "none"}>
                      <path d="M10 17s-6-4.35-6-8.5A3.5 3.5 0 0 1 10 5a3.5 3.5 0 0 1 6 3.5C16 12.65 10 17 10 17z"
                        stroke="#ff6b81" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button
                    className="icon-btn"
                    title="댓글"
                    onClick={() => handleShowComment(post.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <ellipse cx="10" cy="10" rx="7" ry="6" stroke="#888" strokeWidth="1.5" fill="none"/>
                      <path d="M6 16c2.5-1 5.5-1 8 0" stroke="#888" strokeWidth="1.5" fill="none"/>
                    </svg>
                  </button>
                  <button
                    className="icon-btn"
                    title="북마크"
                    onClick={() => handleBookmark(post.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill={post.isBookmarked ? "#4285f4" : "none"}>
                      <path d="M5 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14l-5-3-5 3V3z" 
                        stroke="#888" strokeWidth="1.5"/>
                    </svg>
                  </button>
                  <button
                    className="icon-btn"
                    title="더보기"
                    onClick={() => handleShowMore(post.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="5" r="1.5" fill="#888"/>
                      <circle cx="10" cy="10" r="1.5" fill="#888"/>
                      <circle cx="10" cy="15" r="1.5" fill="#888"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="post-body">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="게시글 이미지" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                  />
                ) : (
                  <div className="post-image-placeholder">이미지 없음</div>
                )}
              </div>
              
              <div className="post-footer">
                <div className="post-profile">
                  {post.user?.profileImage && (
                    <img 
                      src={post.user.profileImage} 
                      alt="프로필" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        borderRadius: '50%' 
                      }} 
                    />
                  )}
                </div>
                <div className="post-info">
                  <div className="post-title">{post.content}</div>
                  <div className="post-meta">
                    {post.user?.username || '사용자'} 
                    {post.hashtags && post.hashtags.length > 0 && (
                      <span> {post.hashtags.map(tag => `#${tag}`).join(' ')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 더보기 메뉴 */}
              {showMore[post.id] && (
                <div className="post-more-menu">
                  <button onClick={() => handleShare(post)}>공유</button>
                  <button onClick={handleReport}>신고</button>
                  <button onClick={() => handleShowMore(post.id)}>닫기</button>
                </div>
              )}

              {/* 댓글창 */}
              {showComment[post.id] && (
                <div className="post-comment-section">
                  <div className="comments-list">
                    {(comments[post.id] || []).map((comment) => (
                      <div className="comment-item" key={comment.id}>
                        <span className="comment-user">{comment.user?.username || '사용자'}</span>
                        <span className="comment-text">{comment.content}</span>
                        {comment.userId === user?.id && (
                          <button
                            className="comment-delete-btn"
                            title="댓글 삭제"
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                          >×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="comment-input-row">
                    <input
                      className="comment-input"
                      type="text"
                      placeholder="댓글을 입력하세요..."
                      value={commentInput[post.id] || ''}
                      onChange={e => handleCommentChange(post.id, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                    />
                    <button 
                      className="comment-add-btn" 
                      onClick={() => handleAddComment(post.id)}
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* 로딩 인디케이터 */}
        {loading && posts.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>더 많은 게시글을 불러오는 중...</p>
          </div>
        )}
        
        {/* 더 이상 게시글이 없을 때 */}
        {!hasMore && posts.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <p>모든 게시글을 확인했습니다.</p>
          </div>
        )}
        
        {/* 게시글이 없을 때 */}
        {!loading && posts.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {tab === 'following' ? (
              <div>
                <p>팔로잉한 사용자들의 게시글이 없습니다.</p>
                <p>다른 사용자를 팔로우해보세요!</p>
              </div>
            ) : (
              <p>게시글이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 스토리 모달 */}
      <StoryModal 
        isOpen={storyModal.isOpen} 
        onClose={closeStoryModal} 
        story={storyModal.story} 
      />
    </div>
  );
};

export default MainContent;