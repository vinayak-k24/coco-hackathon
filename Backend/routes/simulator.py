from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from models.responses import SimulatorStatus

router = APIRouter()

# In-memory simulator state (replaced by proper simulator later)
_sim_state = {
    "running": False,
    "scenario_id": "",
    "speed": 1,
    "started_at": None,
    "paused": False,
}


class SimStartRequest(BaseModel):
    scenario_id: str = "S1"
    speed: int = 10


class SimActionRequest(BaseModel):
    asset_id: str
    action: str  # "derate", "stop", "resume"
    params: dict = {}


@router.post("/sim/start")
def sim_start(req: SimStartRequest):
    _sim_state["running"] = True
    _sim_state["scenario_id"] = req.scenario_id
    _sim_state["speed"] = req.speed
    _sim_state["started_at"] = datetime.now().isoformat()
    _sim_state["paused"] = False
    return {"success": True, "scenario_id": req.scenario_id, "speed": req.speed}


@router.post("/sim/action")
def sim_action(req: SimActionRequest):
    if not _sim_state["running"]:
        return {"success": False, "error": "Simulator not running"}
    return {
        "success": True,
        "asset_id": req.asset_id,
        "action": req.action,
        "applied": True,
    }


@router.post("/sim/reset")
def sim_reset():
    _sim_state["running"] = False
    _sim_state["scenario_id"] = ""
    _sim_state["speed"] = 1
    _sim_state["started_at"] = None
    _sim_state["paused"] = False
    return {"success": True, "state": "reset"}


@router.get("/sim/status", response_model=SimulatorStatus)
def sim_status():
    elapsed = 0
    if _sim_state["running"] and _sim_state["started_at"]:
        started = datetime.fromisoformat(_sim_state["started_at"])
        elapsed_real = (datetime.now() - started).total_seconds() / 60
        elapsed = int(elapsed_real * _sim_state["speed"])

    return SimulatorStatus(
        running=_sim_state["running"],
        scenario_id=_sim_state["scenario_id"],
        speed=_sim_state["speed"],
        elapsed_data_minutes=elapsed,
        current_data_time="",
    )
