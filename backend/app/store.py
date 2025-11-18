from __future__ import annotations

from collections import OrderedDict
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from uuid import uuid4

from .schemas import (
    Comment,
    CreateCommentRequest,
    CreatePostRequest,
    FeedResponse,
    FileAttachment,
    FriendActionRequest,
    FriendRequest,
    FriendRequestDecision,
    Post,
    UpdatePostRequest,
    UpdateProfileRequest,
    User,
)


def _hours_ago(hours: int) -> datetime:
    return datetime.utcnow() - timedelta(hours=hours)


class InMemoryStore:
    def __init__(self) -> None:
        self.current_user = User(
            id="current",
            name="Jan Kowalski",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
            title="Software Engineer",
            bio="Pasjonuję się technologią i innowacjami. Zawsze szukam nowych wyzwań!",
            location="Warszawa, Polska",
            website="",
        )
        self.posts: "OrderedDict[str, Post]" = OrderedDict()
        self.friend_requests: Dict[str, FriendRequest] = {}
        self.friends: Dict[str, User] = {}

        self._seed_posts()
        self._seed_friend_requests()

    def _seed_posts(self) -> None:
        anna = User(
            id="u1",
            name="Anna Kowalska",
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            title="Senior Developer @ Tech Corp",
        )
        piotr = User(
            id="u3",
            name="Piotr Wiśniewski",
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            title="Product Designer",
        )
        maria = User(
            id="u4",
            name="Maria Lewandowska",
            avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            title="Marketing Manager",
        )

        posts = [
            Post(
                id="1",
                user=anna,
                content="Właśnie ukończyłam świetny projekt! Współpraca z zespołem była niesamowita. 🚀",
                images=[
                    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
                ],
                timestamp=_hours_ago(2),
                likes=42,
                likedByUser=False,
                comments=[
                    Comment(
                        id="c1",
                        user=User(
                            id="u2",
                            name="Jan Nowak",
                            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
                        ),
                        content="Gratulacje! Świetna robota!",
                        timestamp=_hours_ago(1),
                        likes=5,
                    )
                ],
            ),
            Post(
                id="2",
                user=piotr,
                content="Nowy design system gotowy! Co myślicie o tych kolorach?",
                images=[
                    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
                ],
                files=[
                    FileAttachment(
                        name="design-system.pdf",
                        type="application/pdf",
                        url="https://example.com/design-system.pdf",
                    )
                ],
                timestamp=_hours_ago(5),
                likes=28,
                likedByUser=True,
                comments=[],
            ),
            Post(
                id="3",
                user=maria,
                content=(
                    "Dzisiaj na konferencji MarketingPro 2025! Dużo inspiracji i nowych pomysłów. "
                    "#marketing #konferencja"
                ),
                timestamp=_hours_ago(8),
                likes=15,
                likedByUser=False,
                comments=[
                    Comment(
                        id="c2",
                        user=User(
                            id="u5",
                            name="Tomasz Zając",
                            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                        ),
                        content="Też tam jestem! Może się spotkamy?",
                        timestamp=_hours_ago(7),
                        likes=2,
                    )
                ],
            ),
        ]

        for post in sorted(posts, key=lambda p: p.timestamp, reverse=True):
            self.posts[post.id] = post

    def _seed_friend_requests(self) -> None:
        requests = [
            FriendRequest(
                id="fr1",
                from_user=User(
                    id="u5",
                    name="Tomasz Lewandowski",
                    avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                    title="Backend Developer",
                ),
                timestamp=_hours_ago(24),
            ),
            FriendRequest(
                id="fr2",
                from_user=User(
                    id="u6",
                    name="Magdalena Zielińska",
                    avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
                    title="Marketing Manager",
                ),
                timestamp=_hours_ago(48),
            ),
        ]

        for request in requests:
            self.friend_requests[request.id] = request

    # Public API -----------------------------------------------------------------
    def get_feed(self) -> FeedResponse:
        return FeedResponse(
            currentUser=self.current_user,
            posts=list(self.posts.values()),
            friendRequests=list(self.friend_requests.values()),
            friends=list(self.friends.values()),
        )

    def create_post(self, payload: CreatePostRequest) -> Post:
        post_id = str(uuid4())
        new_post = Post(
            id=post_id,
            user=self.current_user,
            content=payload.content,
            images=payload.images or None,
            files=payload.files or None,
            timestamp=datetime.utcnow(),
            likes=0,
            likedByUser=False,
            comments=[],
        )
        self.posts = OrderedDict([(new_post.id, new_post), *self.posts.items()])
        return new_post

    def toggle_post_like(self, post_id: str) -> Post:
        post = self._require_post(post_id)
        if post.likedByUser:
            post.likes = max(0, post.likes - 1)
        else:
            post.likes += 1
        post.likedByUser = not post.likedByUser
        return post

    def add_comment(self, post_id: str, payload: CreateCommentRequest) -> Post:
        post = self._require_post(post_id)
        comment = Comment(
            id=str(uuid4()),
            user=self.current_user,
            content=payload.content,
            timestamp=datetime.utcnow(),
            likes=0,
        )
        post.comments.append(comment)
        return post

    def like_comment(self, post_id: str, comment_id: str) -> Post:
        post = self._require_post(post_id)
        comment = self._require_comment(post, comment_id)
        comment.likes += 1
        return post

    def update_post(self, post_id: str, payload: UpdatePostRequest) -> Post:
        post = self._require_post(post_id)
        if payload.content is not None:
            post.content = payload.content
        if payload.images is not None:
            post.images = payload.images or None
        if payload.files is not None:
            post.files = payload.files or None
        return post

    def delete_post(self, post_id: str) -> None:
        if post_id in self.posts:
            self.posts.pop(post_id)

    def update_profile(self, payload: UpdateProfileRequest) -> User:
        update_data = payload.model_dump(exclude_none=True)
        for key, value in update_data.items():
            setattr(self.current_user, key, value)
        return self.current_user

    def add_friend(self, payload: FriendActionRequest) -> Optional[User]:
        user = self._find_user(payload.userId)
        if user:
            self.friends[user.id] = user
        return user

    def remove_friend(self, payload: FriendActionRequest) -> None:
        self.friends.pop(payload.userId, None)

    def decide_friend_request(self, decision: FriendRequestDecision, accept: bool) -> Optional[User]:
        request = self.friend_requests.pop(decision.requestId, None)
        if not request:
            return None
        if accept:
            self.friends[request.from_user.id] = request.from_user
            return request.from_user
        return None

    def list_users(self) -> List[User]:
        users: Dict[str, User] = {self.current_user.id: self.current_user}
        for post in self.posts.values():
            users.setdefault(post.user.id, post.user)
            for comment in post.comments:
                users.setdefault(comment.user.id, comment.user)
        for friend in self.friends.values():
            users.setdefault(friend.id, friend)
        for request in self.friend_requests.values():
            users.setdefault(request.from_user.id, request.from_user)
        return list(users.values())

    # Helpers --------------------------------------------------------------------
    def _require_post(self, post_id: str) -> Post:
        if post_id not in self.posts:
            raise KeyError(f"Post {post_id} not found")
        return self.posts[post_id]

    @staticmethod
    def _require_comment(post: Post, comment_id: str) -> Comment:
        for comment in post.comments:
            if comment.id == comment_id:
                return comment
        raise KeyError(f"Comment {comment_id} not found in post {post.id}")

    def _find_user(self, user_id: str) -> Optional[User]:
        if user_id == self.current_user.id:
            return self.current_user
        for post in self.posts.values():
            if post.user.id == user_id:
                return post.user
            for comment in post.comments:
                if comment.user.id == user_id:
                    return comment.user
        for request in self.friend_requests.values():
            if request.from_user.id == user_id:
                return request.from_user
        return None
