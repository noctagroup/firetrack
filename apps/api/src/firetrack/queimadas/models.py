from datetime import datetime, timezone

from geoalchemy2 import Geometry, WKBElement
from sqlalchemy import DateTime, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column

from firetrack.config import SRID
from firetrack.database.models import Model
from firetrack.queimadas.enums import CicatrizQueimadasStatus


class CicatrizQueimadas(Model):
    id: Mapped[int] = mapped_column(
        Integer, autoincrement=True, primary_key=True, index=True, nullable=False
    )
    bbox: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type="POLYGON", srid=SRID, nullable=False),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )
    periodo_start_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    periodo_end_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    status: Mapped[CicatrizQueimadasStatus] = mapped_column(
        Enum(CicatrizQueimadasStatus),
        default=CicatrizQueimadasStatus.IDLE,
        nullable=False,
    )
