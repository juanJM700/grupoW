import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const PEDIDOS_FILE = path.join(DATA_DIR, "pedidos.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial fallback seeds
const DEFAULT_CONFIG = {
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  nombreGrupo: "Grupo de Impulso Procesal Judicial - WhatsApp",
  destinatarioDefault: "Buen día Dra. Yuly",
  telefonoCoordinador: "51987654321",
  enlaceGrupoWhatsapp: "https://chat.whatsapp.com/pedidos-judiciales-oficial",
  tiposTramite: [
    {
      id: 1,
      titulo: "Proveido Escrito ( Indicar si es reterativo)",
      descripcion: "Solicitud de proveído de escrito pendiente de resolver o calificar (indicar si es reiterativo).",
      icono: "FileClock",
      tagColor: "blue"
    },
    {
      id: 2,
      titulo: "Emisión de Sentencia primera instancia  y segunda instancia",
      descripcion: "Expediente expedito para resolver o emitir sentencia en primera o segunda instancia / auto final.",
      icono: "Scale",
      tagColor: "amber"
    },
    {
      id: 3,
      titulo: "Notificación",
      descripcion: "Impulso de diligenciamiento de cédulas físicas, electrónicas y devolución de cargos.",
      icono: "Send",
      tagColor: "emerald"
    },
    {
      id: 4,
      titulo: "Elevacion de Expedientes",
      descripcion: "Elevación de actuados a Sala Superior o Corte Suprema por apelación o casación concedida.",
      icono: "Layers",
      tagColor: "purple"
    },
    {
      id: 5,
      titulo: "Diligencias o Audiencias",
      descripcion: "Programación, reprogramación o realización de audiencias, declaraciones o inspecciones.",
      icono: "Calendar",
      tagColor: "rose"
    },
    {
      id: 6,
      titulo: "Trámite Documentario",
      descripcion: "Expedición de copias certificadas, oficios, exhortos, endoses y desarchivamiento.",
      icono: "Files",
      tagColor: "cyan"
    },
    {
      id: 7,
      titulo: "Otros y Sugerencias",
      descripcion: "Otras solicitudes procesales, incidencias administrativas o sugerencias de atención judicial.",
      icono: "Sparkles",
      tagColor: "slate"
    }
  ],
  juzgados: [],
  materiasFrecuentes: []
};

function readPedidos(): any[] {
  try {
    if (fs.existsSync(PEDIDOS_FILE)) {
      const data = fs.readFileSync(PEDIDOS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading pedidos file:", err);
  }
  return [];
}

function writePedidos(pedidos: any[]) {
  try {
    fs.writeFileSync(PEDIDOS_FILE, JSON.stringify(pedidos, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing pedidos file:", err);
  }
}

function readConfig(): any {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Error reading config file:", err);
  }
  return DEFAULT_CONFIG;
}

function writeConfig(config: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing config file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // GET /api/pedidos - List all pedidos
  app.get("/api/pedidos", (req, res) => {
    const pedidos = readPedidos();
    res.json(pedidos);
  });

  // POST /api/pedidos - Add or update a pedido
  app.post("/api/pedidos", (req, res) => {
    const newPedido = req.body;
    if (!newPedido || !newPedido.expediente) {
      return res.status(400).json({ error: "Datos del pedido incompletos" });
    }

    const pedidos = readPedidos();
    const existingIndex = pedidos.findIndex((p: any) => p.id === newPedido.id);

    if (existingIndex >= 0) {
      pedidos[existingIndex] = { ...pedidos[existingIndex], ...newPedido };
    } else {
      if (!newPedido.id) {
        newPedido.id = `ped-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      }
      if (!newPedido.fechaCreacion) {
        newPedido.fechaCreacion = new Date().toISOString();
      }
      if (!newPedido.estado) {
        newPedido.estado = "Pendiente";
      }
      pedidos.unshift(newPedido);
    }

    writePedidos(pedidos);
    res.status(200).json(newPedido);
  });

  // PUT /api/pedidos/:id - Update status / notes
  app.put("/api/pedidos/:id", (req, res) => {
    const { id } = req.params;
    const { estado, observaciones, prioridad } = req.body;
    const pedidos = readPedidos();
    const index = pedidos.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    if (estado !== undefined) pedidos[index].estado = estado;
    if (observaciones !== undefined) pedidos[index].observaciones = observaciones;
    if (prioridad !== undefined) pedidos[index].prioridad = prioridad;

    writePedidos(pedidos);
    res.json(pedidos[index]);
  });

  // DELETE /api/pedidos/:id - Delete a pedido
  app.delete("/api/pedidos/:id", (req, res) => {
    const { id } = req.params;
    let pedidos = readPedidos();
    pedidos = pedidos.filter((p: any) => p.id !== id);
    writePedidos(pedidos);
    res.json({ success: true });
  });

  // POST /api/admin/login - Authenticate admin
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const config = readConfig();
    const currentPass = config.adminPassword || process.env.ADMIN_PASSWORD || "admin123";

    if (password === currentPass) {
      res.json({ success: true, token: `adm-${Date.now()}` });
    } else {
      res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }
  });

  // POST /api/admin/change-password - Change admin password
  app.post("/api/admin/change-password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const config = readConfig();
    const currentPass = config.adminPassword || process.env.ADMIN_PASSWORD || "admin123";

    if (currentPassword !== currentPass) {
      return res.status(401).json({ success: false, message: "La contraseña actual no coincide" });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 4 caracteres" });
    }

    config.adminPassword = newPassword.trim();
    writeConfig(config);
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  });

  // GET /api/config
  app.get("/api/config", (req, res) => {
    const config = readConfig();
    // Do not return plain password to client
    const { adminPassword, ...safeConfig } = config;
    res.json(safeConfig);
  });

  // POST /api/config
  app.post("/api/config", (req, res) => {
    const incomingConfig = req.body;
    const currentConfig = readConfig();
    const updated = {
      ...currentConfig,
      ...incomingConfig,
      // Preserve admin password if not explicitly set
      adminPassword: incomingConfig.adminPassword || currentConfig.adminPassword
    };
    writeConfig(updated);
    const { adminPassword, ...safeConfig } = updated;
    res.json(safeConfig);
  });

  // GET /api/export/csv
  app.get("/api/export/csv", (req, res) => {
    const pedidos = readPedidos();
    const headers = ["ID", "Fecha", "Expediente", "Tipo de Tramite", "Juzgado", "Materia", "Especialista", "Requerimiento", "Solicitante", "Telefono", "Prioridad", "Estado", "Observaciones"];
    
    const rows = pedidos.map((p: any) => [
      p.id || "",
      p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleString() : "",
      `"${(p.expediente || "").replace(/"/g, '""')}"`,
      `"${(p.tipoTramite || "").replace(/"/g, '""')}"`,
      `"${(p.juzgado || "").replace(/"/g, '""')}"`,
      `"${(p.materia || "").replace(/"/g, '""')}"`,
      `"${(p.especialista || "").replace(/"/g, '""')}"`,
      `"${(p.requerimiento || "").replace(/"/g, '""')}"`,
      `"${(p.solicitante || "").replace(/"/g, '""')}"`,
      `"${(p.telefono || "").replace(/"/g, '""')}"`,
      p.prioridad || "Normal",
      p.estado || "Pendiente",
      `"${(p.observaciones || "").replace(/"/g, '""')}"`
    ]);

    const csv = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=pedidos_judiciales_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csv);
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

