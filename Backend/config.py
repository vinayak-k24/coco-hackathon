from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    snowflake_account: str = "FPKZODR-SP07148"
    snowflake_user: str = "VSKONE2"
    snowflake_warehouse: str = "COMPUTE_WH"
    snowflake_database: str = "PDM"
    snowflake_role: str = "ACCOUNTADMIN"
    snowflake_authenticator: str = "externalbrowser"
    cors_origins: list[str] = [
        "http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
