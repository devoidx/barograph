from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_password: str = "changeme_strong_password"
    ukho_api_key: str = ""

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://barograph:{self.db_password}@localhost:5434/barograph"

    class Config:
        env_file = "../.env"


settings = Settings()
