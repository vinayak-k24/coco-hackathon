import logging
import snowflake.connector
from config import settings

log = logging.getLogger("db")

_conn = None


def _new_connection():
    return snowflake.connector.connect(
        account=settings.snowflake_account,
        user=settings.snowflake_user,
        warehouse=settings.snowflake_warehouse,
        database=settings.snowflake_database,
        role=settings.snowflake_role,
        authenticator=settings.snowflake_authenticator,
    )


def _get_conn():
    global _conn
    if _conn is None or _conn.is_closed():
        log.info("Opening new Snowflake connection")
        _conn = _new_connection()
    return _conn


def execute_query(
    sql: str, params: dict | None = None
) -> list[dict]:
    """Execute SQL and return rows as list of dicts."""
    for attempt in range(2):
        try:
            conn = _get_conn()
            cur = conn.cursor()
            cur.execute(sql, params or {})
            if cur.description is None:
                return []
            cols = [c[0].lower() for c in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
        except snowflake.connector.errors.ProgrammingError as e:
            if "does not exist" in str(e) or "Object" in str(e):
                return []
            raise
        except snowflake.connector.errors.DatabaseError:
            if attempt == 0:
                log.warning("Connection lost, reconnecting")
                global _conn
                _conn = None
                continue
            raise


def execute_scalar(sql: str, params: dict | None = None):
    """Return first column of first row."""
    rows = execute_query(sql, params)
    if not rows:
        return None
    return next(iter(rows[0].values()))
