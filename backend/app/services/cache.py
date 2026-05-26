import time
from typing import Any

_cache: dict[str, tuple[float, Any]] = {}
TTL = 3600  # 1 hour


def get(key: str) -> Any | None:
    if key in _cache:
        ts, val = _cache[key]
        if time.time() - ts < TTL:
            return val
        del _cache[key]
    return None


def set(key: str, value: Any) -> None:
    _cache[key] = (time.time(), value)
