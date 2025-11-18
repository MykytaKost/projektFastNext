from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl


class FileAttachment(BaseModel):
    name: str
    type: str
    url: HttpUrl | str


class User(BaseModel):
    id: str
    name: str
    avatar: HttpUrl | str
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None


class Comment(BaseModel):
    id: str
    user: User
    content: str
    timestamp: datetime
    likes: int = 0


class Post(BaseModel):
    id: str
    user: User
    content: str
    images: Optional[List[str]] = None
    files: Optional[List[FileAttachment]] = None
    timestamp: datetime
    likes: int = 0
    likedByUser: bool = False
    comments: List[Comment] = Field(default_factory=list)


class FriendRequest(BaseModel):
    id: str
    from_user: User = Field(alias="from")
    timestamp: datetime

    class Config:
        populate_by_name = True
        allow_population_by_field_name = True


class FeedResponse(BaseModel):
    currentUser: User
    posts: List[Post]
    friendRequests: List[FriendRequest]
    friends: List[User]


class CreatePostRequest(BaseModel):
    content: str
    images: List[str] = Field(default_factory=list)
    files: List[FileAttachment] = Field(default_factory=list)


class UpdatePostRequest(BaseModel):
    content: Optional[str] = None
    images: Optional[List[str]] = None
    files: Optional[List[FileAttachment]] = None


class CreateCommentRequest(BaseModel):
    content: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None


class FriendActionRequest(BaseModel):
    userId: str


class FriendRequestDecision(BaseModel):
    requestId: str
