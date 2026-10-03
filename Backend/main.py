import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

from routes import (
    kpis, plants, alerts, orders, assets, maintenance,
    supply_chain, production, energy, technicians,
    activity_stream, finance, incidents, copilot, simulator,
    hero_briefing, recommendations, revenue_impact, insights,
)

app = FastAPI(title="Plant Sentinel", version="0.1.0")

log = logging.getLogger("main")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.error("Unhandled error on %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dashboard data routes
app.include_router(kpis.router, prefix="/api", tags=["Dashboard"])
app.include_router(plants.router, prefix="/api", tags=["Dashboard"])
app.include_router(alerts.router, prefix="/api", tags=["Dashboard"])
app.include_router(orders.router, prefix="/api", tags=["Dashboard"])
app.include_router(hero_briefing.router, prefix="/api", tags=["Dashboard"])
app.include_router(recommendations.router, prefix="/api", tags=["Dashboard"])
app.include_router(revenue_impact.router, prefix="/api", tags=["Dashboard"])
app.include_router(production.router, prefix="/api", tags=["Production"])
app.include_router(energy.router, prefix="/api", tags=["Energy"])
app.include_router(activity_stream.router, prefix="/api", tags=["Activity"])

# Asset & Maintenance routes
app.include_router(assets.router, prefix="/api", tags=["Assets"])
app.include_router(maintenance.router, prefix="/api", tags=["Maintenance"])
app.include_router(technicians.router, prefix="/api", tags=["Workforce"])

# Hub page routes
app.include_router(supply_chain.router, prefix="/api", tags=["Supply Chain"])
app.include_router(finance.router, prefix="/api", tags=["Finance"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])

# Incident lifecycle
app.include_router(incidents.router, prefix="/api", tags=["Incidents"])

# Copilot / Intelligence
app.include_router(copilot.router, prefix="/api", tags=["Copilot"])

# Simulator
app.include_router(simulator.router, prefix="/api", tags=["Simulator"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "plant-sentinel-backend"}
