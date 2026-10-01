import pandas as pd
import numpy as np
from faker import Faker
import os
from datetime import datetime, timedelta

fake = Faker()
np.random.seed(42)
os.makedirs("csv_data", exist_ok=True)

# Base counts
N_TRANS = 500  # Transactional/Time-series
N_MASTER = 50  # Master data (to maintain relational realism)

def save(df, name):
    df.to_csv(f"csv_data/{name}.csv", index=False)
    print(f"Generated {name}.csv")

# ==========================================
# 1. Master & Reference Data (7)
# ==========================================
save(pd.DataFrame([{
    "Plant_ID": f"PLANT_{i:02d}", "Plant_Name": fake.company() + " Plant", "Physical_Address": fake.address(),
    "GPS_Lat": round(np.random.uniform(10, 40), 4), "GPS_Lon": round(np.random.uniform(70, 80), 4),
    "Timezone": "IST", "Total_Floor_Area_SqFt": np.random.randint(10000, 100000),
    "Num_Production_Lines": np.random.randint(2, 10), "Facility_Type": np.random.choice(["Assembly", "Machining", "Processing"])
} for i in range(1, 11)]), "01_site_facility")

save(pd.DataFrame([{
    "Line_ID": f"LINE_{i:03d}", "Line_Name": f"Line {i}", "Line_Type": np.random.choice(["Automated", "Manual", "Hybrid"]),
    "Max_Throughput": np.random.randint(100, 1000), "Associated_Machines": f"ASSET_{i:03d},ASSET_{i+1:03d}"
} for i in range(1, N_MASTER+1)]), "02_production_lines_cells")

save(pd.DataFrame([{
    "Asset_ID": f"ASSET_{i:03d}", "Asset_Name": f"{fake.company()} {fake.random_element(['CNC', 'Pump', 'Conveyor'])}",
    "Asset_Type": np.random.choice(["CNC", "Pump", "Conveyor", "Robot Arm"]), "Manufacturer_Name": fake.company(),
    "Model_Number": fake.bothify(text='??-####'), "Serial_Number": fake.bothify(text='SN-########'),
    "Date_of_Manufacture": fake.date_between('-5y', '-1y').isoformat(), "Installation_Date": fake.date_between('-4y', '-1y').isoformat(),
    "Warranty_Expiry_Date": fake.date_between('now', '+2y').isoformat(), "Criticality_Level": np.random.randint(1, 6),
    "Physical_Location": f"Zone_{np.random.randint(1,5)}/Aisle_{np.random.randint(1,10)}",
    "Initial_Purchase_Cost": round(np.random.uniform(50000, 500000), 2), "Depreciation_Method": "Straight Line"
} for i in range(1, N_MASTER+1)]), "03_machines_assets")

save(pd.DataFrame([{
    "Component_ID": f"COMP_{i:04d}", "Component_Name": fake.word() + " " + fake.word(),
    "Component_Type": np.random.choice(["Bearing", "Motor", "Gearbox", "Servo Drive", "Valve", "Sensor"]),
    "Parent_Asset_ID": f"ASSET_{np.random.randint(1, N_MASTER+1):03d}", "OEM_Part_Number": fake.bothify(text='OEM-####'),
    "Expected_Design_Life": np.random.randint(1000, 10000), "Weight_kg": round(np.random.uniform(1, 100), 2),
    "Material_Composition": np.random.choice(["Steel", "Aluminum", "Composite"]), "Criticality_to_Asset_Function": np.random.choice([True, False])
} for i in range(1, N_MASTER*2+1)]), "04_components_sub_assemblies")

save(pd.DataFrame([{
    "Part_ID": f"PART_{i:04d}", "Part_Name": fake.word() + " " + fake.word(), "Part_Description": fake.sentence(),
    "Part_Category": np.random.choice(["Electrical", "Mechanical", "Consumable"]), "Unit_Cost": round(np.random.uniform(10, 500), 2),
    "Supplier_ID": f"SUP_{np.random.randint(1, 21):03d}", "Lead_Time_Days": np.random.randint(1, 30),
    "Min_Stock_Level": 10, "Max_Stock_Level": 100, "Reorder_Point": 20,
    "Storage_Location": f"Warehouse_A/Zone_{np.random.randint(1,5)}/Rack_{np.random.randint(1,10)}"
} for i in range(1, N_MASTER*2+1)]), "05_spare_parts_catalog")

save(pd.DataFrame([{
    "Supplier_ID": f"SUP_{i:03d}", "Supplier_Name": fake.company(), "Contact_Person": fake.name(),
    "Email": fake.email(), "Phone_Number": fake.phone_number(), "Physical_Address": fake.address(),
    "Supplier_Rating": np.random.randint(1, 6), "Avg_Delivery_Time_Days": round(np.random.uniform(1, 15), 1),
    "Payment_Terms": np.random.choice(["Net 30", "Net 60", "COD"])
} for i in range(1, 21)]), "06_suppliers_vendors")

save(pd.DataFrame([{
    "Product_ID": f"PROD_{i:03d}", "Product_Name": fake.word().capitalize() + " " + fake.word().capitalize(),
    "Product_Category": fake.word(), "Target_Cycle_Time_Sec": round(np.random.uniform(10, 120), 1),
    "Standard_Cost": round(np.random.uniform(50, 500), 2), "Selling_Price": round(np.random.uniform(100, 1000), 2),
    "BOM_ID": f"BOM_{i:03d}", "Quality_Tolerance_Upper": round(np.random.uniform(50.1, 50.5), 2),
    "Quality_Tolerance_Lower": round(np.random.uniform(49.5, 49.9), 2)
} for i in range(1, 21)]), "07_products_skus")

# ==========================================
# 2. Machine & Equipment OT Sensor Data (7)
# ==========================================
base_time = datetime.now() - timedelta(days=30)
timestamps = [(base_time + timedelta(minutes=i*10)).isoformat() for i in range(N_TRANS)]
asset_ids = [f"ASSET_{i:03d}" for i in range(1, N_MASTER+1)]

def gen_sensor_df(cols, base_vals, std_devs):
    data = []
    for ts in timestamps:
        for aid in asset_ids[:5]: # Limit to 5 assets to keep file size manageable
            row = {"Timestamp": ts, "Asset_ID": aid}
            for col, base, std in zip(cols, base_vals, std_devs):
                if isinstance(base, str):
                    row[col] = base
                elif isinstance(base, bool):
                    row[col] = bool(np.random.randint(0, 2))
                else:
                    row[col] = round(np.random.normal(base, std), 3)
            data.append(row)
    return pd.DataFrame(data)

save(gen_sensor_df(
    ["Vibration_X_mm_s", "Vibration_Y_mm_s", "Vibration_Z_mm_s", "RMS_Velocity_mm_s", "Peak_to_Peak_Displacement_um", "Acceleration_g", "Dominant_Frequency_Hz", "Crest_Factor", "Kurtosis"],
    [2.0, 2.0, 2.0, 2.5, 10.0, 0.5, 50.0, 3.0, 3.0], [0.5, 0.5, 0.5, 0.4, 2.0, 0.1, 5.0, 0.2, 0.2]
), "08_vibration_dynamics")

save(gen_sensor_df(
    ["Motor_Winding_Temp_C", "Bearing_Outer_Race_Temp_C", "Bearing_Inner_Race_Temp_C", "Ambient_Air_Temp_C", "Coolant_Temp_C", "Exhaust_Gas_Temp_C", "Hydraulic_Fluid_Temp_C"],
    [65.0, 60.0, 62.0, 25.0, 40.0, 150.0, 45.0], [2.0, 1.5, 1.5, 1.0, 2.0, 5.0, 2.0]
), "09_temperature_thermal")

save(gen_sensor_df(
    ["Rotational_Speed_RPM", "Torque_Output_Nm", "Angular_Velocity_rad_s", "Linear_Speed_m_s", "Stroke_Rate_strokes_min", "Feed_Rate_mm_min", "Spindle_Speed_RPM", "Axis_Position_X_mm", "Axis_Position_Y_mm", "Axis_Position_Z_mm"],
    [1500, 120, 157, 2.0, 60, 500, 1500, 0.0, 0.0, 0.0], [15, 5, 2, 0.1, 2, 10, 15, 0.01, 0.01, 0.01]
), "10_rotational_motion")

save(gen_sensor_df(
    ["Voltage_Phase_1_V", "Voltage_Phase_2_V", "Voltage_Phase_3_V", "Current_Phase_1_A", "Current_Phase_2_A", "Current_Phase_3_A", "Active_Power_kW", "Reactive_Power_kVAR", "Apparent_Power_kVA", "Power_Factor", "Frequency_Hz", "Phase_Angle_deg", "Total_Harmonic_Distortion_pct"],
    [400, 400, 400, 15, 15, 15, 8.5, 2.0, 9.0, 0.95, 50.0, 120, 2.0], [5, 5, 5, 1, 1, 1, 0.5, 0.2, 0.3, 0.02, 0.1, 2, 0.5]
), "11_electrical_power")

save(gen_sensor_df(
    ["Hydraulic_Pressure_bar", "Pneumatic_Pressure_bar", "Fluid_Flow_Rate_L_min", "Fluid_Level_pct", "Fluid_Viscosity_cSt", "Fluid_pH_Level", "Moisture_Content_in_Air_pct", "Filter_Differential_Pressure_bar"],
    [150, 7.0, 20, 80, 32, 7.0, 40, 1.0], [5, 0.2, 2, 5, 2, 0.1, 5, 0.2]
), "12_fluid_hydraulic_pneumatic")

save(gen_sensor_df(
    ["Ambient_Noise_Level_dB", "Ultrasonic_Emission_dBuV", "Acoustic_Frequency_kHz", "Cavitation_Index"],
    [75, 40, 20, 0.1], [2, 5, 2, 0.05]
), "13_acoustic_ultrasonic")

save(gen_sensor_df(
    ["Laser_Micrometer_Distance_mm", "Color_Sensor_R", "Color_Sensor_G", "Color_Sensor_B", "Proximity_Switch_State", "Limit_Switch_State", "Encoder_Pulse_Count", "Camera_Frame_Image_Path"],
    [50.0, 200, 200, 200, 1, 1, 1000, "/img/frame.jpg"], [0.1, 10, 10, 10, 0, 0, 50, 0]
), "14_optical_vision_position")

# ==========================================
# 3. Facility & Environmental Sensor Data (3)
# ==========================================
save(gen_sensor_df(
    ["Ambient_Room_Temp_C", "Relative_Humidity_pct", "Barometric_Pressure_hPa", "CO2_Concentration_ppm", "VOCs_ppb", "PM2_5", "PM10"],
    [24.0, 45.0, 1013, 400, 50, 12, 20], [1.5, 5.0, 5, 20, 10, 2, 3]
), "15_climate_air")

save(gen_sensor_df(
    ["Main_Water_Flow_Rate_L_min", "Total_Water_Volume_m3", "Compressed_Air_Pressure_bar", "Compressed_Air_Flow_Rate_m3_min", "Natural_Gas_Flow_Rate_m3_h", "Steam_Pressure_bar"],
    [50, 100, 7.0, 5, 10, 4.0], [5, 10, 0.2, 0.5, 1, 0.2]
), "16_utilities_resources")

save(gen_sensor_df(
    ["Lighting_Level_Lux", "Floor_Vibration_mm_s", "Background_Noise_Floor_dB", "Door_Access_Control_State", "Fire_Smoke_Detector_State"],
    [500, 0.5, 40, 1, 0], [20, 0.1, 2, 0, 0]
), "17_facility_conditions")

# ==========================================
# 4. Production & MES Data (4)
# ==========================================
save(pd.DataFrame([{
    "Job_ID": f"JOB_{10000+i}", "Product_ID": f"PROD_{np.random.randint(1,21):03d}",
    "Planned_Quantity": 1000, "Actual_Quantity_Produced": np.random.randint(950, 1000),
    "Planned_Start_Time": (base_time + timedelta(hours=i)).isoformat(), "Actual_Start_Time": (base_time + timedelta(hours=i, minutes=np.random.randint(0,10))).isoformat(),
    "Planned_End_Time": (base_time + timedelta(hours=i, minutes=60)).isoformat(), "Actual_End_Time": (base_time + timedelta(hours=i, minutes=60+np.random.randint(0,10))).isoformat(),
    "Job_Status": np.random.choice(["Queued", "Running", "Completed", "Aborted"], p=[0.1, 0.1, 0.75, 0.05])
} for i in range(N_TRANS)]), "18_job_order_execution")

save(pd.DataFrame([{
    "Timestamp": (base_time + timedelta(minutes=i*10)).isoformat(), "Machine_ID": np.random.choice(asset_ids[:5]),
    "State_Code": np.random.choice(["Running", "Idle", "Starved", "Blocked", "Setup", "Changeover", "Planned Maintenance", "Unplanned Breakdown", "Clean-up"]),
    "State_Duration_Sec": np.random.randint(60, 3600), "Downtime_Reason_Code": np.random.choice(["NO_MATERIAL", "TOOL_BREAK", "SENSOR_FAULT", "NONE"])
} for i in range(N_TRANS)]), "19_machine_state_downtime")

save(pd.DataFrame([{
    "Timestamp": (base_time + timedelta(minutes=i*10)).isoformat(), "Machine_ID": np.random.choice(asset_ids[:5]),
    "Parameter_Name": np.random.choice(["Cutting Speed", "Feed Rate", "Spindle Load"]),
    "Target_Value": round(np.random.uniform(100, 500), 1), "Actual_Value": round(np.random.uniform(95, 505), 1),
    "Unit_of_Measure": "mm/min", "Operator_Override_Flag": np.random.choice([True, False], p=[0.05, 0.95])
} for i in range(N_TRANS)]), "20_process_parameters")

save(pd.DataFrame([{
    "Transaction_ID": f"TXN_{i}", "Job_ID": f"JOB_{10000+i}", "Raw_Material_Batch_ID": f"BATCH_{np.random.randint(1,100)}",
    "Material_ID": f"MAT_{np.random.randint(1,20)}", "Quantity_Consumed": round(np.random.uniform(1, 10), 2),
    "Unit_of_Measure": "kg", "Timestamp": (base_time + timedelta(hours=i)).isoformat(), "Scrap_Quantity_Generated": round(np.random.uniform(0, 0.5), 2)
} for i in range(N_TRANS)]), "21_material_consumption")

# ==========================================
# 5. Quality & Inspection Data (3)
# ==========================================
save(pd.DataFrame([{
    "Inspection_ID": f"INSP_{i}", "Job_ID": f"JOB_{10000+i}", "Unit_Serial_Number": f"SN-{np.random.randint(100000, 999999)}",
    "Timestamp": (base_time + timedelta(hours=i)).isoformat(), "Pass_Fail_Status": np.random.choice(["PASS", "FAIL"], p=[0.92, 0.08]),
    "Defect_Type": np.random.choice(["Scratch", "Dent", "Dimension Error", "None"]),
    "Defect_Location_X": round(np.random.uniform(0, 100), 2), "Defect_Location_Y": round(np.random.uniform(0, 100), 2), "Defect_Location_Z": round(np.random.uniform(0, 100), 2),
    "Measured_Value": round(np.random.normal(50.0, 0.5), 3), "Target_Value": 50.0, "Tolerance_Limit": 0.2, "Vision_System_Confidence_Score": round(np.random.uniform(0.85, 0.99), 2)
} for i in range(N_TRANS)]), "22_inline_automated_inspection")

save(pd.DataFrame([{
    "Test_ID": f"TEST_{i}", "Batch_ID": f"BATCH_{np.random.randint(1,100)}",
    "Test_Type": np.random.choice(["Tensile Strength", "Hardness", "Chemical Composition"]),
    "Measured_Result": round(np.random.uniform(100, 500), 2), "Unit_of_Measure": "MPa",
    "Test_Standard": np.random.choice(["ASTM", "ISO"]), "Technician_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Timestamp": (base_time + timedelta(hours=i)).isoformat(), "Pass_Fail_Status": np.random.choice(["PASS", "FAIL"], p=[0.95, 0.05])
} for i in range(N_TRANS)]), "23_lab_manual_testing")

save(pd.DataFrame([{
    "Surface_Roughness_Ra_um": round(np.random.normal(1.6, 0.2), 2), "Roundness_um": round(np.random.normal(5, 1), 2),
    "Flatness_um": round(np.random.normal(10, 2), 2), "Concentricity_um": round(np.random.normal(8, 1.5), 2),
    "Weight_grams": round(np.random.normal(500, 5), 2), "Length_mm": round(np.random.normal(100, 0.5), 2),
    "Width_mm": round(np.random.normal(50, 0.2), 2), "Height_mm": round(np.random.normal(20, 0.1), 2)
} for i in range(N_TRANS)]), "24_surface_dimensional")

# ==========================================
# 6. Maintenance & CMMS Data (5)
# ==========================================
save(pd.DataFrame([{
    "Work_Order_ID": f"WO_{i}", "Asset_ID": np.random.choice(asset_ids),
    "Work_Order_Type": np.random.choice(["Preventive", "Predictive", "Corrective", "Emergency"]),
    "Priority": np.random.randint(1, 6), "Description": fake.sentence(), "Requested_By": fake.name(),
    "Assigned_Technician_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Planned_Start_Time": (base_time + timedelta(days=np.random.randint(1,30))).isoformat(), "Actual_Start_Time": (base_time + timedelta(days=np.random.randint(1,30))).isoformat(),
    "Planned_End_Time": (base_time + timedelta(days=np.random.randint(2,31))).isoformat(), "Actual_End_Time": (base_time + timedelta(days=np.random.randint(2,31))).isoformat(),
    "Status": np.random.choice(["Open", "In Progress", "On Hold", "Completed", "Cancelled"]),
    "Total_Labor_Hours": round(np.random.uniform(1, 8), 1), "Total_Parts_Cost": round(np.random.uniform(50, 500), 2)
} for i in range(N_TRANS)]), "25_work_orders")

save(pd.DataFrame([{
    "Task_ID": f"TASK_{i}", "Work_Order_ID": f"WO_{np.random.randint(1, N_TRANS)}", "Step_Number": np.random.randint(1, 5),
    "Instruction_Text": fake.sentence(), "Estimated_Duration_Min": np.random.randint(10, 60),
    "Required_Tool_ID": f"TOOL_{np.random.randint(1,50)}", "Required_PPE": np.random.choice([True, False]), "Safety_Lockout_Required": np.random.choice([True, False])
} for i in range(N_TRANS)]), "26_maintenance_tasks_steps")

save(pd.DataFrame([{
    "Usage_ID": f"USE_{i}", "Work_Order_ID": f"WO_{np.random.randint(1, N_TRANS)}", "Part_ID": f"PART_{np.random.randint(1, 101):04d}",
    "Quantity_Used": np.random.randint(1, 5), "Unit_Cost": round(np.random.uniform(10, 100), 2),
    "Total_Cost": round(np.random.uniform(10, 500), 2), "Timestamp": (base_time + timedelta(hours=i)).isoformat()
} for i in range(N_TRANS)]), "27_parts_usage_consumption")

save(pd.DataFrame([{
    "Reading_ID": f"READ_{i}", "Asset_ID": np.random.choice(asset_ids),
    "Meter_Type": np.random.choice(["Hour Meter", "Cycle Counter", "Mileage"]),
    "Current_Reading_Value": round(np.random.uniform(1000, 50000), 1), "Timestamp": (base_time + timedelta(hours=i)).isoformat()
} for i in range(N_TRANS)]), "28_meter_readings")

save(pd.DataFrame([{
    "Failure_ID": f"FAIL_{i}", "Work_Order_ID": f"WO_{np.random.randint(1, N_TRANS)}",
    "Failure_Mode": np.random.choice(["Wear", "Fatigue", "Corrosion"]),
    "Failure_Cause": np.random.choice(["Lack of Lubrication", "Overload", "Misalignment"]),
    "Failure_Consequence": np.random.choice(["Production Stop", "Safety Hazard", "Minor Delay"]),
    "ISO_14224_Code": fake.bothify(text='###-??')
} for i in range(N_TRANS)]), "29_failure_root_cause_codes")

# ==========================================
# 7. Human, Shift & Operator Data (4)
# ==========================================
save(pd.DataFrame([{
    "Shift_ID": f"SHIFT_{i}", "Shift_Name": np.random.choice(["Morning", "Afternoon", "Night"]),
    "Start_Time": "08:00:00", "End_Time": "16:00:00", "Break_Start_Time": "12:00:00", "Break_End_Time": "12:30:00", "Shift_Duration_Hours": 8.0
} for i in range(1, 21)]), "30_shift_management")

save(pd.DataFrame([{
    "Assignment_ID": f"ASSGN_{i}", "Shift_ID": f"SHIFT_{np.random.randint(1, 21)}",
    "Operator_Technician_ID": f"TECH_{np.random.randint(1,21):03d}", "Assigned_Machine_ID": np.random.choice(asset_ids),
    "Assigned_Line_ID": f"LINE_{np.random.randint(1, 51):03d}", "Role": np.random.choice(["Operator", "Maintenance Tech", "Supervisor"])
} for i in range(N_TRANS)]), "31_operator_technician_assignments")

save(pd.DataFrame([{
    "Log_ID": f"LOG_{i}", "Operator_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Timestamp": (base_time + timedelta(hours=i)).isoformat(),
    "Action_Type": np.random.choice(["Login", "Logout", "Parameter Change", "Manual Override", "Alarm Acknowledge"]),
    "Old_Value": str(round(np.random.uniform(10, 100), 1)), "New_Value": str(round(np.random.uniform(10, 100), 1)), "Reason_Code": "Routine"
} for i in range(N_TRANS)]), "32_operator_actions_logs")

save(pd.DataFrame([{
    "Certification_ID": f"CERT_{i}", "Technician_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Certification_Type": np.random.choice(["High Voltage", "Forklift", "CNC Programming", "Welding"]),
    "Issue_Date": fake.date_between('-2y', '-1y').isoformat(), "Expiry_Date": fake.date_between('now', '+1y').isoformat(), "Issuing_Authority": fake.company()
} for i in range(50)]), "33_skills_certifications")

# ==========================================
# 8. Energy & Utilities Metering Data (3)
# ==========================================
save(pd.DataFrame([{
    "Meter_ID": f"EMETER_{i}", "Timestamp": (base_time + timedelta(hours=i)).isoformat(),
    "Active_Energy_Consumed_kWh": round(np.random.uniform(100, 500), 2), "Reactive_Energy_Consumed_kVAh": round(np.random.uniform(10, 50), 2),
    "Peak_Demand_kW": round(np.random.uniform(80, 120), 1), "Power_Factor_Average": round(np.random.uniform(0.85, 0.99), 2)
} for i in range(N_TRANS)]), "34_electrical_metering")

save(pd.DataFrame([{
    "Meter_ID": f"RMETER_{i}", "Timestamp": (base_time + timedelta(hours=i)).isoformat(),
    "Water_Consumed_m3": round(np.random.uniform(1, 10), 2), "Natural_Gas_Consumed_m3": round(np.random.uniform(5, 20), 2),
    "Compressed_Air_Consumed_m3": round(np.random.uniform(10, 50), 2), "Steam_Consumed_kg": round(np.random.uniform(50, 200), 2)
} for i in range(N_TRANS)]), "35_resource_metering")

save(pd.DataFrame([{
    "Tariff_ID": f"TAR_{i}", "Time_of_Day_Start": "00:00:00", "Time_of_Day_End": "23:59:59",
    "Cost_per_kWh": round(np.random.uniform(0.10, 0.25), 3), "Cost_per_m3_Water": round(np.random.uniform(1.0, 3.0), 2),
    "Cost_per_m3_Gas": round(np.random.uniform(0.5, 1.5), 2), "Demand_Charge": round(np.random.uniform(10, 20), 2)
} for i in range(10)]), "36_tariff_cost_data")
# ==========================================
# 9. Unstructured & Document Data (6)
# ==========================================
save(pd.DataFrame([{
    "Document_ID": f"DOC_{i}", "Asset_ID": np.random.choice(asset_ids),
    "Document_Type": np.random.choice(["Installation", "Operation", "Troubleshooting", "Parts Diagram"]),
    "Page_Number": np.random.randint(1, 50), "Text_Chunk_Content": fake.paragraph(), "Extracted_Keywords": fake.words(3), "Last_Updated_Date": fake.date()
} for i in range(N_TRANS)]), "37_oem_manuals_documentation")

save(pd.DataFrame([{
    "SOP_ID": f"SOP_{i}", "Process_Name": fake.word(), "SOP_Title": fake.sentence(), "Step_Number": np.random.randint(1, 10),
    "Step_Instruction_Text": fake.sentence(), "Safety_Warning_Text": fake.sentence(), "Required_PPE_List": "Gloves, Goggles", "Version_Number": "1.0"
} for i in range(N_TRANS)]), "38_standard_operating_procedures")

save(pd.DataFrame([{
    "Log_ID": f"MLOG_{i}", "Work_Order_ID": f"WO_{np.random.randint(1, N_TRANS)}", "Technician_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Timestamp": (base_time + timedelta(hours=i)).isoformat(), "Free_Text_Notes": fake.sentence(),
    "Sentiment_Score": round(np.random.uniform(-1, 1), 2), "Extracted_Entities": f"PART_{np.random.randint(1,101):04d}"
} for i in range(N_TRANS)]), "39_historical_maintenance_logs")

save(pd.DataFrame([{
    "Regulation_ID": f"REG_{i}", "Standard_Name": np.random.choice(["OSHA 1910", "ISO 45001", "ISO 9001"]),
    "Section_Number": fake.bothify(text='###.##'), "Regulation_Text": fake.paragraph(),
    "Applicability": np.random.choice(["Electrical Safety", "Machine Guarding", "Chemical Handling"]), "Penalty_for_Non_Compliance": "Fine / Shutdown"
} for i in range(N_TRANS)]), "40_safety_compliance_regulations")

save(pd.DataFrame([{
    "Note_ID": f"NOTE_{i}", "Shift_ID": f"SHIFT_{np.random.randint(1, 21)}", "Author_ID": f"TECH_{np.random.randint(1,21):03d}",
    "Timestamp": (base_time + timedelta(hours=i)).isoformat(), "Free_Text_Content": fake.sentence(), "Priority_Flag": np.random.choice([True, False])
} for i in range(N_TRANS)]), "41_shift_handover_notes")

save(pd.DataFrame([{
    "Contract_ID": f"CON_{i}", "Asset_ID": np.random.choice(asset_ids), "Vendor_ID": f"SUP_{np.random.randint(1, 21):03d}",
    "Start_Date": fake.date(), "End_Date": fake.date(),
    "Coverage_Terms_Text": fake.paragraph(), "Exclusion_Terms_Text": fake.paragraph(), "Claim_Process_Text": fake.sentence(), "Deductible_Amount": round(np.random.uniform(100, 1000), 2)
} for i in range(N_TRANS)]), "42_warranty_sla_contracts")

# ==========================================
# 10. Supply Chain & Inventory Transaction Data (3)
# ==========================================
save(pd.DataFrame([{
    "Transaction_ID": f"INV_TXN_{i}", "Part_ID": f"PART_{np.random.randint(1, 101):04d}",
    "Transaction_Type": np.random.choice(["Receipt", "Issue", "Transfer", "Adjustment", "Return"]),
    "Quantity": np.random.randint(1, 50), "Unit_Cost": round(np.random.uniform(10, 100), 2),
    "Total_Value": round(np.random.uniform(100, 5000), 2), "Timestamp": (base_time + timedelta(hours=i)).isoformat(),
    "Reference_Document_ID": f"PO_{np.random.randint(1, 100)}"
} for i in range(N_TRANS)]), "43_inventory_transactions")

save(pd.DataFrame([{
    "PO_ID": f"PO_{i}", "Supplier_ID": f"SUP_{np.random.randint(1, 21):03d}", "Part_ID": f"PART_{np.random.randint(1, 101):04d}",
    "Quantity_Ordered": np.random.randint(10, 100), "Unit_Price": round(np.random.uniform(10, 100), 2),
    "Total_Price": round(np.random.uniform(100, 10000), 2), "Order_Date": fake.date(),
    "Expected_Delivery_Date": fake.date_between('now', '+1m').isoformat(), "Actual_Delivery_Date": fake.date_between('now', '+1m').isoformat(),
    "Status": np.random.choice(["Draft", "Approved", "Shipped", "Received", "Invoiced"])
} for i in range(N_TRANS)]), "44_purchase_orders")

save(pd.DataFrame([{
    "Location_ID": f"LOC_{i}", "Warehouse_Name": "Main Warehouse", "Zone": f"Zone_{np.random.randint(1,5)}",
    "Aisle": f"Aisle_{np.random.randint(1,10)}", "Rack": f"Rack_{np.random.randint(1,5)}", "Shelf": f"Shelf_{np.random.randint(1,3)}", "Bin": f"Bin_{np.random.randint(1,10)}",
    "Capacity_Units": 1000, "Current_Occupancy_Units": np.random.randint(100, 900), "Last_Cycle_Count_Date": fake.date()
} for i in range(N_TRANS)]), "45_warehouse_logistics")

print("Successfully generated all 45 CSV files in the 'csv_data' directory.")
