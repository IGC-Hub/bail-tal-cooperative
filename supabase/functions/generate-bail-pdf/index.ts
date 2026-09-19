import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Constantes de mise en page ---
const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 50;
const MARGIN_TOP = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const LINE_HEIGHT = 16;
const SECTION_GAP = 24;

const TAL_BLUE = rgb(0, 0.24, 0.36); // #003D5C
const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.4, 0.4, 0.4);

// --- Helpers de rendu PDF ---
interface RenderContext {
  doc: PDFDocument;
  page: PDFPage;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  y: number;
}

function ensureSpace(ctx: RenderContext, needed: number): RenderContext {
  if (ctx.y - needed < MARGIN_TOP) {
    ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    ctx.y = PAGE_HEIGHT - MARGIN_TOP;
  }
  return ctx;
}

function drawTitle(ctx: RenderContext, text: string): RenderContext {
  ctx = ensureSpace(ctx, 30);
  ctx.page.drawText(text, {
    x: MARGIN_LEFT,
    y: ctx.y,
    size: 16,
    font: ctx.fontBold,
    color: TAL_BLUE,
  });
  ctx.y -= 28;
  return ctx;
}

function drawSubtitle(ctx: RenderContext, text: string): RenderContext {
  ctx = ensureSpace(ctx, 24);
  ctx.page.drawText(text, {
    x: MARGIN_LEFT,
    y: ctx.y,
    size: 12,
    font: ctx.fontBold,
    color: BLACK,
  });
  ctx.y -= 20;
  return ctx;
}

function drawField(ctx: RenderContext, label: string, value: string | undefined | null, xOffset = 0): RenderContext {
  ctx = ensureSpace(ctx, LINE_HEIGHT + 4);
  const displayValue = value || '—';
  ctx.page.drawText(`${label} :`, {
    x: MARGIN_LEFT + xOffset,
    y: ctx.y,
    size: 9,
    font: ctx.fontBold,
    color: GRAY,
  });
  const labelWidth = ctx.fontBold.widthOfTextAtSize(`${label} : `, 9);
  ctx.page.drawText(displayValue, {
    x: MARGIN_LEFT + xOffset + labelWidth,
    y: ctx.y,
    size: 10,
    font: ctx.fontRegular,
    color: BLACK,
  });
  ctx.y -= LINE_HEIGHT;
  return ctx;
}

function drawFieldRow(ctx: RenderContext, fields: { label: string; value: string | undefined | null }[]): RenderContext {
  ctx = ensureSpace(ctx, LINE_HEIGHT + 4);
  const colWidth = CONTENT_WIDTH / fields.length;
  for (let i = 0; i < fields.length; i++) {
    const displayValue = fields[i].value || '—';
    ctx.page.drawText(`${fields[i].label} :`, {
      x: MARGIN_LEFT + i * colWidth,
      y: ctx.y,
      size: 9,
      font: ctx.fontBold,
      color: GRAY,
    });
    const labelWidth = ctx.fontBold.widthOfTextAtSize(`${fields[i].label} : `, 9);
    ctx.page.drawText(displayValue, {
      x: MARGIN_LEFT + i * colWidth + labelWidth,
      y: ctx.y,
      size: 10,
      font: ctx.fontRegular,
      color: BLACK,
    });
  }
  ctx.y -= LINE_HEIGHT;
  return ctx;
}

function drawCheckbox(ctx: RenderContext, label: string, checked: boolean | undefined): RenderContext {
  ctx = ensureSpace(ctx, LINE_HEIGHT + 4);
  const symbol = checked ? '☑' : '☐';
  ctx.page.drawText(`${symbol} ${label}`, {
    x: MARGIN_LEFT + 10,
    y: ctx.y,
    size: 10,
    font: ctx.fontRegular,
    color: BLACK,
  });
  ctx.y -= LINE_HEIGHT;
  return ctx;
}

function drawSeparator(ctx: RenderContext): RenderContext {
  ctx = ensureSpace(ctx, 12);
  ctx.page.drawLine({
    start: { x: MARGIN_LEFT, y: ctx.y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: ctx.y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  ctx.y -= SECTION_GAP;
  return ctx;
}

function drawServiceRow(ctx: RenderContext, label: string, value: string | undefined): RenderContext {
  ctx = ensureSpace(ctx, LINE_HEIGHT + 4);
  const displayValue = value === 'cooperative' ? 'Coopérative' : value === 'locataire' ? 'Locataire' : '—';
  ctx.page.drawText(label, {
    x: MARGIN_LEFT + 10,
    y: ctx.y,
    size: 10,
    font: ctx.fontRegular,
    color: BLACK,
  });
  ctx.page.drawText(displayValue, {
    x: PAGE_WIDTH - MARGIN_RIGHT - 80,
    y: ctx.y,
    size: 10,
    font: ctx.fontBold,
    color: BLACK,
  });
  ctx.y -= LINE_HEIGHT;
  return ctx;
}

function formatCurrency(amount: number | undefined): string {
  if (amount === undefined || amount === null) return '—';
  return `${amount.toFixed(2)} $`;
}

function formatDate(date: string | undefined): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('fr-CA');
  } catch {
    return date;
  }
}

// --- Fonction principale ---
// deno-lint-ignore no-explicit-any
async function buildBailPDF(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let ctx: RenderContext = { doc, page, fontRegular, fontBold, y: PAGE_HEIGHT - MARGIN_TOP };

  // --- En-tête ---
  ctx.page.drawText('BAIL D\'UN LOGEMENT', {
    x: MARGIN_LEFT,
    y: ctx.y,
    size: 20,
    font: fontBold,
    color: TAL_BLUE,
  });
  ctx.y -= 24;
  ctx.page.drawText('Coopérative d\'habitation du Québec', {
    x: MARGIN_LEFT,
    y: ctx.y,
    size: 12,
    font: fontRegular,
    color: GRAY,
  });
  ctx.y -= 16;
  ctx.page.drawText('Formulaire conforme au Tribunal administratif du logement', {
    x: MARGIN_LEFT,
    y: ctx.y,
    size: 9,
    font: fontRegular,
    color: GRAY,
  });
  ctx.y -= SECTION_GAP;
  ctx = drawSeparator(ctx);

  // --- Section A : Identification ---
  ctx = drawTitle(ctx, 'A — Identification');

  ctx = drawSubtitle(ctx, '1. Coopérative');
  const coop = data.cooperative || {};
  ctx = drawField(ctx, 'Nom', coop.nom);
  ctx = drawFieldRow(ctx, [
    { label: 'No', value: coop.numero },
    { label: 'Rue', value: coop.rue },
    { label: 'App', value: coop.app },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'Ville', value: coop.ville },
    { label: 'Province', value: coop.province },
    { label: 'Code postal', value: coop.code_postal },
  ]);
  if (coop.mandataire_organisme) {
    ctx.y -= 8;
    ctx = drawField(ctx, 'Gestionnaire', coop.mandataire_organisme);
  }
  ctx = drawFieldRow(ctx, [
    { label: 'Signataire', value: [coop.signataire_prenom, coop.signataire_nom].filter(Boolean).join(' ') },
    { label: 'Qualité', value: coop.signataire_qualite },
  ]);
  ctx.y -= 8;

  ctx = drawSubtitle(ctx, '2. Locataire principal');
  const loc = data.locataire_principal || {};
  ctx = drawFieldRow(ctx, [
    { label: 'Prénom', value: loc.prenom },
    { label: 'Nom', value: loc.nom },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'No', value: loc.numero },
    { label: 'Rue', value: loc.rue },
    { label: 'App', value: loc.app },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'Municipalité', value: loc.municipalite },
    { label: 'Code postal', value: loc.code_postal },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'Téléphone', value: loc.telephone },
    { label: 'Courriel', value: loc.courriel },
  ]);

  if (data.locataire_supplementaire?.nom) {
    ctx.y -= 8;
    ctx = drawSubtitle(ctx, '3. Locataire supplémentaire');
    const loc2 = data.locataire_supplementaire;
    ctx = drawFieldRow(ctx, [
      { label: 'Prénom', value: loc2.prenom },
      { label: 'Nom', value: loc2.nom },
    ]);
    ctx = drawFieldRow(ctx, [
      { label: 'Téléphone', value: loc2.telephone },
      { label: 'Courriel', value: loc2.courriel },
    ]);
  }

  ctx = drawSeparator(ctx);

  // --- Section B : Logement ---
  ctx = drawTitle(ctx, 'B — Description du logement');
  const logement = data.logement || {};
  const adr = logement.adresse || {};
  ctx = drawFieldRow(ctx, [
    { label: 'No', value: adr.numero },
    { label: 'Rue', value: adr.rue },
    { label: 'App', value: adr.app },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'Municipalité', value: adr.municipalite },
    { label: 'Code postal', value: adr.code_postal },
  ]);
  ctx = drawField(ctx, 'Nombre de pièces', logement.nombre_pieces?.toString());

  if (logement.stationnement_exterieur?.nombre) {
    ctx = drawField(ctx, 'Stationnement extérieur', `${logement.stationnement_exterieur.nombre} place(s) — ${logement.stationnement_exterieur.emplacements || ''}`);
  }
  if (logement.stationnement_interieur?.nombre) {
    ctx = drawField(ctx, 'Stationnement intérieur', `${logement.stationnement_interieur.nombre} place(s) — ${logement.stationnement_interieur.emplacements || ''}`);
  }
  if (logement.autres_accessoires) {
    ctx = drawField(ctx, 'Autres accessoires', logement.autres_accessoires);
  }
  ctx = drawCheckbox(ctx, 'Avertisseurs de fumée conformes', logement.engagement_avertisseurs_fumee);

  ctx = drawSeparator(ctx);

  // --- Section C : Durée ---
  ctx = drawTitle(ctx, 'C — Durée du bail');
  const duree = data.duree || {};
  if (duree.type === 'fixe') {
    ctx = drawField(ctx, 'Type', 'Bail à durée fixe');
    ctx = drawField(ctx, 'Durée', `${duree.duree_nombre || '—'} ${duree.duree_unite || ''}`);
    ctx = drawFieldRow(ctx, [
      { label: 'Début', value: formatDate(duree.date_debut) },
      { label: 'Fin', value: formatDate(duree.date_fin) },
    ]);
  } else if (duree.type === 'indeterminee') {
    ctx = drawField(ctx, 'Type', 'Bail à durée indéterminée');
    ctx = drawField(ctx, 'Commencement', formatDate(duree.date_commencement));
  } else {
    ctx = drawField(ctx, 'Type', '—');
  }

  ctx = drawSeparator(ctx);

  // --- Section D : Loyer ---
  ctx = drawTitle(ctx, 'D — Loyer');
  const loyer = data.loyer || {};
  ctx = drawFieldRow(ctx, [
    { label: 'Loyer de base', value: formatCurrency(loyer.loyer_base) },
    { label: 'Coût des services', value: formatCurrency(loyer.cout_services) },
    { label: 'Total', value: formatCurrency(loyer.loyer_total) },
  ]);
  ctx = drawField(ctx, 'Fréquence', loyer.frequence === 'mois' ? 'Par mois' : loyer.frequence === 'semaine' ? 'Par semaine' : '—');
  ctx = drawCheckbox(ctx, 'Programme de subvention', loyer.programme_subvention);
  if (loyer.programme_subvention && loyer.details_subvention) {
    ctx = drawField(ctx, 'Détails', loyer.details_subvention);
  }

  const paiement = loyer.paiement || {};
  ctx.y -= 8;
  ctx = drawSubtitle(ctx, 'Paiement');
  ctx = drawFieldRow(ctx, [
    { label: 'Premier terme', value: formatDate(paiement.premier_terme_date) },
    { label: 'Jour', value: paiement.jour_paiement?.toString() },
  ]);
  const modes: Record<string, string> = { comptant: 'Comptant', cheque: 'Chèque', virement: 'Virement', autre: paiement.mode_autre || 'Autre' };
  ctx = drawField(ctx, 'Mode', modes[paiement.mode || ''] || '—');
  ctx = drawField(ctx, 'Lieu de paiement', paiement.lieu);

  ctx = drawSeparator(ctx);

  // --- Section E : Services et conditions ---
  ctx = drawTitle(ctx, 'E — Services et conditions');

  const services = data.services || {};
  if (services.reglement_immeuble?.reglement_remis) {
    ctx = drawCheckbox(ctx, `Règlement d'immeuble remis le ${formatDate(services.reglement_immeuble.date_remise)}`, true);
  }
  if (services.travaux_reparations?.travaux_avant_delivrance) {
    ctx = drawField(ctx, 'Travaux avant délivrance', services.travaux_reparations.travaux_avant_delivrance);
  }
  if (services.service_concierge?.service_concierge_actif) {
    ctx = drawField(ctx, 'Concierge', services.service_concierge.nom);
  }

  const taxes = services.services_taxes || {};
  if (Object.keys(taxes).length > 0) {
    ctx.y -= 8;
    ctx = drawSubtitle(ctx, 'Services, taxes et consommations');
    ctx = drawServiceRow(ctx, 'Chauffage', taxes.chauffage);
    ctx = drawServiceRow(ctx, 'Électricité (autre que chauffage)', taxes.electricite_autre);
    ctx = drawServiceRow(ctx, 'Location chauffe-eau', taxes.chauffe_eau_location);
    ctx = drawServiceRow(ctx, 'Eau chaude (utilisation)', taxes.eau_chaude_utilisation);
    ctx = drawServiceRow(ctx, 'Taxe d\'eau', taxes.taxe_eau);
  }

  if (services.conditions) {
    ctx.y -= 8;
    ctx = drawCheckbox(ctx, 'Logement sans fumée', services.conditions.sans_fumee);
    ctx = drawCheckbox(ctx, 'Animaux permis', services.conditions.animaux_permis);
  }

  if (services.autres_services) {
    ctx = drawField(ctx, 'Autres services', services.autres_services);
  }

  ctx = drawSeparator(ctx);

  // --- Section F : Restrictions ---
  const restrictions = data.restrictions || {};
  if (restrictions.situation) {
    ctx = drawTitle(ctx, 'F — Restrictions');
    ctx = drawField(ctx, 'Situation', restrictions.situation === 'membre' ? 'Membre de la coopérative' : 'Non-membre');
    if (restrictions.immeuble_recent) {
      ctx = drawField(ctx, 'Immeuble récent — Date mise en service', formatDate(restrictions.immeuble_pret_date));
    }
    if (restrictions.loyer_maximal) {
      ctx = drawField(ctx, 'Loyer maximal', formatCurrency(restrictions.loyer_maximal));
    }
    ctx = drawSeparator(ctx);
  }

  // --- Section H : Solidarité ---
  const solidarite = data.solidarite || {};
  if (solidarite.engagement_solidaire || solidarite.autres_signataires?.length) {
    ctx = drawTitle(ctx, 'H — Solidarité et caution');
    ctx = drawCheckbox(ctx, 'Engagement solidaire', solidarite.engagement_solidaire);

    if (solidarite.autres_signataires?.length) {
      ctx.y -= 8;
      ctx = drawSubtitle(ctx, 'Autres signataires');
      // deno-lint-ignore no-explicit-any
      for (const sig of solidarite.autres_signataires as any[]) {
        const qualites: Record<string, string> = { caution: 'Caution', garant: 'Garant', autre: sig.qualite_autre || 'Autre' };
        ctx = drawFieldRow(ctx, [
          { label: 'Nom', value: [sig.prenom, sig.nom].filter(Boolean).join(' ') },
          { label: 'Qualité', value: qualites[sig.qualite] || sig.qualite },
        ]);
        ctx = drawField(ctx, 'Adresse', sig.adresse);
      }
    }
    ctx = drawSeparator(ctx);
  }

  // --- Signatures ---
  ctx = drawTitle(ctx, 'Signatures');
  const sigs = data.signatures || {};

  ctx.y -= 8;
  ctx = drawSubtitle(ctx, 'Coopérative');
  ctx = drawFieldRow(ctx, [
    { label: 'Nom', value: sigs.signature_coop_nom },
    { label: 'Qualité', value: sigs.signature_coop_qualite },
  ]);
  ctx = drawFieldRow(ctx, [
    { label: 'Date', value: formatDate(sigs.signature_coop_date) },
    { label: 'Lieu', value: sigs.signature_coop_lieu },
  ]);
  ctx = drawCheckbox(ctx, 'Bail accepté et signé', sigs.signature_coop_accepte);

  ctx.y -= 12;
  ctx = drawSubtitle(ctx, 'Locataire principal');
  ctx = drawFieldRow(ctx, [
    { label: 'Nom', value: sigs.signature_locataire1_nom },
    { label: 'Date', value: formatDate(sigs.signature_locataire1_date) },
  ]);
  ctx = drawField(ctx, 'Lieu', sigs.signature_locataire1_lieu);
  ctx = drawCheckbox(ctx, 'Bail accepté et signé', sigs.signature_locataire1_accepte);

  if (sigs.signature_locataire2_nom) {
    ctx.y -= 12;
    ctx = drawSubtitle(ctx, 'Locataire supplémentaire');
    ctx = drawFieldRow(ctx, [
      { label: 'Nom', value: sigs.signature_locataire2_nom },
      { label: 'Date', value: formatDate(sigs.signature_locataire2_date) },
    ]);
    ctx = drawCheckbox(ctx, 'Bail accepté et signé', sigs.signature_locataire2_accepte);
  }

  // --- Pied de page sur chaque page ---
  const pages = doc.getPages();
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    const footerText = `Bail TAL — ${coop.nom || 'Coopérative'} — Page ${i + 1}/${totalPages}`;
    p.drawText(footerText, {
      x: MARGIN_LEFT,
      y: 25,
      size: 8,
      font: fontRegular,
      color: GRAY,
    });
    const dateText = `Généré le ${new Date().toLocaleDateString('fr-CA')}`;
    const dateWidth = fontRegular.widthOfTextAtSize(dateText, 8);
    p.drawText(dateText, {
      x: PAGE_WIDTH - MARGIN_RIGHT - dateWidth,
      y: 25,
      size: 8,
      font: fontRegular,
      color: GRAY,
    });
  }

  return doc.save();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header manquant' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
        db: { schema: 'core' },
      }
    );

    // Vérifier l'utilisateur
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { lease_id } = await req.json();
    if (!lease_id) {
      return new Response(JSON.stringify({ error: 'lease_id requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Charger les données du bail
    const { data: lease, error: leaseError } = await supabase
      .from('leases')
      .select('bail_tal_data')
      .eq('id', lease_id)
      .single();

    if (leaseError || !lease) {
      return new Response(JSON.stringify({ error: 'Bail introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Générer le PDF
    const pdfBytes = await buildBailPDF(lease.bail_tal_data);

    // Upload dans Supabase Storage
    const fileName = `bail_${lease_id}_${Date.now()}.pdf`;
    const filePath = `bails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('bail-pdfs')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      return new Response(JSON.stringify({ error: 'Erreur lors de l\'upload du PDF' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('bail-pdfs')
      .getPublicUrl(filePath);

    const pdfUrl = urlData.publicUrl;

    // Mettre à jour le bail
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('leases')
      .update({
        bail_tal_statut: 'complete',
        bail_tal_genere: true,
        bail_tal_date_generation: now,
        bail_tal_lien_pdf: pdfUrl,
      })
      .eq('id', lease_id);

    if (updateError) {
      console.error('Erreur update lease:', updateError);
    }

    // Logger la génération
    await supabase.from('bail_generation_logs').insert({
      lease_id,
      generated_by: user.id,
      generated_at: now,
      pdf_url: pdfUrl,
      status: 'success',
    });

    return new Response(
      JSON.stringify({ pdf_url: pdfUrl, generated_at: now }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Erreur generate-bail-pdf:', err);
    return new Response(
      JSON.stringify({ error: 'Erreur interne lors de la génération' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
