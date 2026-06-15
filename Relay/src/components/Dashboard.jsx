import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import GlowOrbs from "./GlowOrb";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user =
    location.state?.user || JSON.parse(localStorage.getItem("gridlock_user"));
  const token = localStorage.getItem("gridlock_token");

  const today = new Date().toISOString().split("T")[0];

  const [faults, setFaults] = useState([]);
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [shift, setShift] = useState("");
  const [area, setArea] = useState("");
  const [dateRaised, setDateRaised] = useState(today);
  const [tagType, setTagType] = useState("Mechanical");
  const [actionToBeTaken, setActionToBeTaken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token || !user) navigate("/");
    else fetchFaults();
  }, []);

  const fetchFaults = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/faults", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFaults(data);
      }
    } catch (error) {
      console.error("Failed to fetch faults");
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevents browser from opening the file in a new tab
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.type.startsWith("image/")) return; // Ensure it's an image
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Generate a temporary local preview URL
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    if (!equipment || !description || !shift || !area) return;

    setIsSubmitting(true);

    // Build the multipart/form-data payload
    const formData = new FormData();
    formData.append("equipment", equipment);
    formData.append("description", description);
    formData.append("priority", priority);
    formData.append("shift", shift);
    formData.append("area", area);
    formData.append("dateRaised", dateRaised);
    formData.append("tagType", tagType);
    formData.append("actionToBeTaken", actionToBeTaken);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:5000/api/faults", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT SET 'Content-Type'. The browser sets it automatically with the boundary for FormData.
        },
        body: formData,
      });

      if (response.ok) {
        const newFault = await response.json();
        setFaults([newFault, ...faults]);

        // Reset form
        setEquipment("");
        setDescription("");
        setShift("");
        setArea("");
        setActionToBeTaken("");
        setPriority("Medium");
        setTagType("Mechanical");
        clearImage();
      }
    } catch (error) {
      console.error("Failed to log issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <GlowOrbs />
      <Navbar user={user} />

      <main
        className="dashboard-content"
        style={{ position: "relative", zIndex: 10 }}
      >
        <section className="form-section">
          <div className="section-header">
            <h3>Log a New Issue</h3>
            <span className="branch-tag">
              {user?.branch || "Unknown Branch"}
            </span>
          </div>

          <form className="issue-form" onSubmit={handleSubmitIssue}>
            <div className="form-row">
              <div className="input-group">
                <label>Area / Plant Section</label>
                <input
                  type="text"
                  placeholder="e.g. Packaging, Brew House"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Shift</label>
                <input
                  type="text"
                  placeholder="e.g. Morning, Night, Shift A"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Equipment / Machine Name</label>
                <input
                  type="text"
                  placeholder="e.g. Filler Line 3, Conveyor B"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Date Raised</label>
                <input
                  type="date"
                  value={dateRaised}
                  onChange={(e) => setDateRaised(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Tag Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="Mechanical"
                      checked={tagType === "Mechanical"}
                      onChange={(e) => setTagType(e.target.value)}
                    />{" "}
                    Mechanical
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Electrical"
                      checked={tagType === "Electrical"}
                      onChange={(e) => setTagType(e.target.value)}
                    />{" "}
                    Electrical
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Safety"
                      checked={tagType === "Safety"}
                      onChange={(e) => setTagType(e.target.value)}
                    />{" "}
                    Safety
                  </label>
                </div>
              </div>
              <div className="input-group">
                <label>Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low - Monitor</option>
                  <option value="Medium">Medium - Requires Maintenance</option>
                  <option value="High">High - Impeding Production</option>
                  <option value="Critical">Critical - Safety/Line Stop</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description of Fault</label>
              <textarea
                placeholder="Describe the exact issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="input-group">
              <label>Description of Action to be Taken</label>
              <textarea
                placeholder="What steps need to be taken to resolve this? (Optional)"
                value={actionToBeTaken}
                onChange={(e) => setActionToBeTaken(e.target.value)}
                rows="2"
              ></textarea>
            </div>

            {/* --- VISUAL UPLOAD ZONE --- */}
            <div className="input-group">
              <label>Photographic Evidence (Optional)</label>

              {!imagePreview ? (
                <div
                  className={`drop-zone ${isDragging ? "drag-active" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="drop-zone-content">
                    <span
                      style={{
                        fontSize: "2rem",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    ></span>
                    <p>
                      Drag & Drop an image here, or{" "}
                      <strong>click to browse</strong>.
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#666" }}>
                      Mobile users: Click to activate camera or gallery.
                    </p>
                  </div>
                  {/* Hidden input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={clearImage}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-issue-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Transmitting..." : "Attach Tag to Database"}
            </button>
          </form>
        </section>

        <section className="feed-section">
          <h3 className="feed-title">Active Reports</h3>
          <div className="fault-list">
            {faults.length === 0 ? (
              <p className="empty-state">
                No issues currently logged for this operator.
              </p>
            ) : (
              faults.map((fault) => (
                <div key={fault._id} className="fault-card">
                  <div className="fault-card-header">
                    <span
                      className={`status-badge ${fault.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {fault.status}
                    </span>
                    <span className="timestamp">
                      {new Date(
                        fault.dateRaised || fault.createdAt,
                      ).toLocaleDateString()}{" "}
                      — {fault.shift} Shift
                    </span>
                  </div>
                  <div className="fault-card-body">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <h4 className="equipment-title">
                        {fault.equipment}{" "}
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#888",
                            fontWeight: "normal",
                          }}
                        >
                          | {fault.area}
                        </span>
                      </h4>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#bbb",
                          border: "1px solid #444",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {fault.tagType} Tag
                      </span>
                    </div>
                    <p className="fault-desc" style={{ marginTop: "8px" }}>
                      {fault.description}
                    </p>

                    {/* Render the image if it exists */}
                    {fault.imageUrl && (
                      <div className="feed-image-container">
                        <img
                          src={fault.imageUrl}
                          alt="Fault Evidence"
                          className="feed-image"
                        />
                      </div>
                    )}

                    {fault.actionToBeTaken && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "10px",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          borderRadius: "6px",
                          borderLeft: "3px solid #4ade80",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#4ade80",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                          }}
                        >
                          Action Required:
                        </span>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "0.9rem",
                            color: "#ddd",
                          }}
                        >
                          {fault.actionToBeTaken}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="fault-card-footer">
                    <span
                      className={`priority-indicator ${fault.priority.toLowerCase()}`}
                    >
                      <span className="dot"></span> {fault.priority} Priority
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
