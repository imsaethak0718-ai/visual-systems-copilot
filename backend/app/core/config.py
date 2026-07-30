from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Visual Systems Copilot API"


settings = Settings()
