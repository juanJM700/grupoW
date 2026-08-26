import { SolicitudPedido } from '../types';

export function formatToWhatsAppMessage(
  pedido: Partial<SolicitudPedido>, 
  options: {
    formatStyle?: 'clasico' | 'estructurado_emoji' | 'compacto';
    includeSolicitante?: boolean;
  } = {}
): string {
  const { formatStyle = 'clasico', includeSolicitante = false } = options;

  const saludo = pedido.saludo?.trim() || 'Buen día dra. Yuly';
  const tipoTramite = pedido.tipoTramite?.trim() || '';
  const expediente = pedido.expediente?.trim() || '';
  const juzgado = pedido.juzgado?.trim() || '';
  const materia = pedido.materia?.trim() || '';
  const especialista = pedido.especialista?.trim() || '';
  const requerimiento = pedido.requerimiento?.trim() || '';
  const solicitante = pedido.solicitante?.trim() || '';
  const telefono = pedido.telefono?.trim() || '';
  const colegiatura = pedido.colegiaturaOCasilla?.trim() || '';

  if (formatStyle === 'clasico') {
    // Exact faithful replica of the requested judicial group format
    let msg = `${saludo}\n`;
    if (tipoTramite) {
      msg += `TIPO DE TRÁMITE: ${tipoTramite}\n`;
    }
    msg += `EXPEDIENTE     : ${expediente}\n`;
    msg += `JUZGADO        : ${juzgado}\n`;
    msg += `MATERIA        : ${materia}\n`;
    msg += `ESPECIALISTA   : ${especialista}\n`;
    msg += `REQUERIMIENTO  : ${requerimiento}`;

    if (includeSolicitante && (solicitante || telefono || colegiatura)) {
      msg += `\nSOLICITANTE    : ${solicitante}${colegiatura ? ` (${colegiatura})` : ''}${telefono ? ` - Cel: ${telefono}` : ''}`;
    }

    return msg;
  }

  if (formatStyle === 'estructurado_emoji') {
    let msg = `${saludo}\n\n`;
    msg += `⚖️ *REGISTRO DE PEDIDO JUDICIAL*\n`;
    msg += `─────────────────────────\n`;
    if (tipoTramite) {
      msg += `📋 *TIPO DE TRÁMITE :* ${tipoTramite}\n`;
    }
    msg += `📁 *EXPEDIENTE      :* ${expediente}\n`;
    msg += `🏛️ *JUZGADO         :* ${juzgado}\n`;
    msg += `📜 *MATERIA         :* ${materia}\n`;
    msg += `👤 *ESPECIALISTA    :* ${especialista}\n`;
    msg += `─────────────────────────\n`;
    msg += `📝 *REQUERIMIENTO   :*\n${requerimiento}\n`;

    if (includeSolicitante && (solicitante || telefono || colegiatura)) {
      msg += `─────────────────────────\n`;
      msg += `🧑‍💼 *SOLICITANTE:* ${solicitante || 'Abogado patrocinante'}\n`;
      if (colegiatura) msg += `🔖 *CASILLA/REG :* ${colegiatura}\n`;
      if (telefono) msg += `📱 *TELÉFONO    :* ${telefono}\n`;
    }

    return msg.trim();
  }

  // Compact
  let msg = `*${saludo}*\n`;
  if (tipoTramite) msg += `*Trámite:* ${tipoTramite} | `;
  msg += `*Exp:* ${expediente} | *Juzgado:* ${juzgado} | *Materia:* ${materia} | *Esp:* ${especialista}\n`;
  msg += `*Requerimiento:* ${requerimiento}`;
  if (includeSolicitante && solicitante) {
    msg += `\n*Por:* ${solicitante} (${telefono})`;
  }
  return msg;
}

export function generateWhatsAppLink(message: string, phoneNumber?: string): string {
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '') : '';
  const encodedText = encodeURIComponent(message);
  
  if (cleanPhone && cleanPhone.length >= 8) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Intelligent parser to parse raw text from WhatsApp chat into form fields
 */
export function parseRawWhatsAppMessage(rawText: string): Partial<SolicitudPedido> {
  const result: Partial<SolicitudPedido> = {};
  if (!rawText) return result;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // Check first line for greeting
  if (lines.length > 0) {
    const first = lines[0];
    if (/^(buen|buena|hola|estimad|dra\.|dr\.)/i.test(first)) {
      result.saludo = first;
    }
  }

  // Extract by regex patterns
  const patterns: { key: keyof SolicitudPedido; regex: RegExp }[] = [
    { key: 'tipoTramite', regex: /(?:tipo\s*de\s*tr[aá]mite|tramite)\s*[:=]\s*(.+)/i },
    { key: 'expediente', regex: /(?:expediente|exp\.?)\s*[:=]\s*([0-9a-zA-Z\-_/]+)/i },
    { key: 'juzgado', regex: /(?:juzgado|organo\s*jurisdiccional)\s*[:=]\s*(.+)/i },
    { key: 'materia', regex: /(?:materia)\s*[:=]\s*(.+)/i },
    { key: 'especialista', regex: /(?:especialista|secretario|asistente)\s*[:=]\s*(.+)/i },
    { key: 'solicitante', regex: /(?:solicitante|abogado|letrado|por)\s*[:=]\s*(.+)/i },
    { key: 'telefono', regex: /(?:tel[eé]fono|celular|cel|whatsapp|ws)\s*[:=]\s*([+0-9\s\-]+)/i }
  ];

  for (const { key, regex } of patterns) {
    const match = rawText.match(regex);
    if (match && match[1]) {
      (result as Record<string, string>)[key] = match[1].trim();
    }
  }

  // Extract Requerimiento (everything after REQUERIMIENTO: or DETALLE:)
  const reqMatch = rawText.match(/(?:requerimiento|solicitud|motivo|pedido|detalle)\s*[:=]\s*([\s\S]+?)(?=(?:SOLICITANTE|TEL|CASILLA|────────|━━━━━━━━|$))/i);
  if (reqMatch && reqMatch[1]) {
    result.requerimiento = reqMatch[1].trim();
  }

  // Extract Expediente if not found with label but found with standard pattern
  if (!result.expediente) {
    const expDirect = rawText.match(/(\d{4,5}-\d{4}-\d+-\d{4}-[A-Z]{2}-[A-Z]{2}-\d{1,2})/);
    if (expDirect && expDirect[1]) {
      result.expediente = expDirect[1];
    }
  }

  return result;
}
