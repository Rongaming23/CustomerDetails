
// ===============================
// FIRESTORE EXPORT + ANALYTICS
// ===============================

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// CSV EXPORT (FIXED + SAFE)
// ===============================

window.exportCSV = async function () {

    try {

        const snapshot = await getDocs(collection(db, "cases"));

        let csv =
`Ticket ID,Name,Phone,Order ID,Order Date,Outlet,Issue,Concern,Delivery Partner,Status,Agent,Created At\n`;

        snapshot.forEach(docSnap => {

            const d = docSnap.data();

            const row = [
                d.ticketId || "",
                d.name || "",
                d.phone || "",
                d.orderId || "",
                d.orderDate || "",
                d.outlet || "",
                d.issue || "",
                (d.concern || "").replace(/"/g, '""'),
                d.deliveryPartner || "",
                d.status || "",
                d.agent || "",
                d.createdAt || ""
            ];

            csv += row.map(v => `"${v}"`).join(",") + "\n";
        });

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "CRM_Report.csv";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    } catch (err) {
        console.error("CSV Export Error:", err);
        alert("Failed to export CSV");
    }
};


// ===============================
// AGENT PERFORMANCE (FIXED)
// ===============================

window.agentPerformance = async function () {

    try {

        const snapshot = await getDocs(collection(db, "cases"));

        let stats = {};

        snapshot.forEach(docSnap => {

            const d = docSnap.data();

            const agent = d.agent || "Unassigned";

            stats[agent] = (stats[agent] || 0) + 1;
        });

        let html = "<h3>👤 Agent Performance</h3><br>";

        const agents = Object.keys(stats);

        if (agents.length === 0) {
            html += "<p>No agent data found</p>";
        } else {

            agents.forEach(agent => {

                html += `
                <div class="card" style="margin-bottom:10px;">
                    <b>${agent}</b><br>
                    Cases Handled: ${stats[agent]}
                </div>
                `;
            });
        }

        const area = document.getElementById("reportArea");

        if (area) {
            area.innerHTML = html;
        }

    } catch (err) {
        console.error("Agent Report Error:", err);
        alert("Failed to load agent performance");
    }
};
