from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import Optional

from app.database import get_db
from app.config import get_settings
from app.models.schemas import UserCreate, UserLogin, UserResponse, TokenResponse

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def get_current_user_optional(token: str = Depends(oauth2_scheme)) -> Optional[str]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload.get("sub")
    except JWTError:
        return None


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id


router = APIRouter()


@router.post("/signup", response_model=TokenResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # TODO: Use Supabase Auth in production
    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id="00000000-0000-0000-0000-000000000000",
            email=user.email,
            full_name=user.full_name,
            avatar_url=None,
            created_at=datetime.utcnow()
        )
    )


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user."""
    # TODO: Use Supabase Auth in production
    access_token = create_access_token(data={"sub": form_data.username})
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id="00000000-0000-0000-0000-000000000000",
            email=form_data.username,
            full_name=None,
            avatar_url=None,
            created_at=datetime.utcnow()
        )
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user_id: str = Depends(get_current_user)):
    """Get current authenticated user."""
    return UserResponse(
        id="00000000-0000-0000-0000-000000000000",
        email=current_user_id,
        full_name=None,
        avatar_url=None,
        created_at=datetime.utcnow()
    )


@router.post("/logout")
def logout(current_user_id: str = Depends(get_current_user)):
    """Logout user."""
    return {"message": "Successfully logged out"}
