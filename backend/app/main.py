from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    CreateCommentRequest,
    CreatePostRequest,
    FeedResponse,
    FriendActionRequest,
    FriendRequestDecision,
    Post,
    UpdatePostRequest,
    UpdateProfileRequest,
)
from .store import InMemoryStore

app = FastAPI(title="SocialHub API", version="0.1.0")
store = InMemoryStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/feed")
def get_feed() -> dict:
    feed = store.get_feed()
    return feed.model_dump(by_alias=True)


@app.get("/users")
def list_users() -> dict:
    return {"users": [user.model_dump() for user in store.list_users()]}


@app.post("/posts", response_model=Post)
def create_post(payload: CreatePostRequest) -> Post:
    return store.create_post(payload)


@app.post("/posts/{post_id}/like", response_model=Post)
def like_post(post_id: str) -> Post:
    try:
        return store.toggle_post_like(post_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/posts/{post_id}/comments", response_model=Post)
def add_comment(post_id: str, payload: CreateCommentRequest) -> Post:
    try:
        return store.add_comment(post_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.post("/posts/{post_id}/comments/{comment_id}/like", response_model=Post)
def like_comment(post_id: str, comment_id: str) -> Post:
    try:
        return store.like_comment(post_id, comment_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.patch("/posts/{post_id}", response_model=Post)
def update_post(post_id: str, payload: UpdatePostRequest) -> Post:
    try:
        return store.update_post(post_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.delete("/posts/{post_id}")
def delete_post(post_id: str) -> dict[str, bool]:
    store.delete_post(post_id)
    return {"deleted": True}


@app.patch("/profile")
def update_profile(payload: UpdateProfileRequest) -> dict:
    user = store.update_profile(payload)
    return {"user": user}


@app.post("/friends")
def add_friend(payload: FriendActionRequest) -> dict:
    user = store.add_friend(payload)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"friend": user}


@app.delete("/friends")
def remove_friend(payload: FriendActionRequest) -> dict:
    store.remove_friend(payload)
    return {"removed": True}


@app.post("/friend-requests/accept")
def accept_friend_request(decision: FriendRequestDecision) -> dict:
    user = store.decide_friend_request(decision, accept=True)
    if not user:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"friend": user}


@app.post("/friend-requests/reject")
def reject_friend_request(decision: FriendRequestDecision) -> dict:
    store.decide_friend_request(decision, accept=False)
    return {"rejected": True}
