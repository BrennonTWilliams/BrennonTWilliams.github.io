#!/opt/homebrew/bin/bash
# gen-prompt.sh — print a ready-to-paste image gen prompt for a project cover
set -euo pipefail

STYLE="Bold two-color linocut poster print on aged bone-white cotton rag paper, fusing 1950s–60s NASA mission-program graphic design with Soviet Constructivist composition — no Soviet iconography, purely the graphic grammar. COMPOSITION: asymmetric diagonal thrust, dominant subject mass pushed off-center toward the upper or lower two-thirds, never bilaterally symmetric — dynamic tilt and lean like a Constructivist broadside. FORMS: large flat carbon-black silhouette blocks anchor the composition; fine razor-thin carved relief lines overlay atomic-age technical diagrams floating across the blocked forms — electron orbital rings with dot-nodes on the paths, parabolic re-entry trajectory arcs, molecular bond lattices, altitude-calibration tick marks, stellar coordinate crosshairs, and mission-patch medallion rings as secondary geometry. TEXTURE: visible ink over-bite at carved block edges, paper grain beneath ink, slight tonal variation within flat areas from uneven press — pure hand-cut print character. PALETTE: carbon-black ink on warm bone/cream ground, single focal element in deep vermillion only. EXPLICIT PROHIBITIONS: no bilateral symmetry, no decorative fan borders, no scallop ornament, no stepped chevron frames, no Art Deco ornament, no Asian characters, no hammers or Soviet stars. Portrait 5:7 aspect ratio."

declare -A SUBJECTS
SUBJECTS[little-loops]="A recursive ouroboros of looping arrows encircling a grid of numbered issue tickets and sprint cards, with FSM state-transition nodes branching outward like electron paths."
SUBJECTS[claude-loop]="A single autonomous agent arrow looping back on itself, surrounded by concentric orbital rings of decision nodes and branching task trees, like an atomic diagram of machine cognition."
SUBJECTS[blender-agents]="A Blender viewport grid viewed at oblique angle — geometric mesh primitives (sphere, cube, armature skeleton) anchored in the lower mass, their wireframe edges dissolving upward into an OODA loop orchestration graph. Agent decision nodes at each loop phase (Observe, Orient, Decide, Act) orbit the scene like electron shells, connected by bold trajectory vectors to the 3D tool operations below."
SUBJECTS[graphrag-claude-code]="An exploded knowledge graph — nodes as orbital junction points, edges as trajectory vectors — radiating outward from a central document nucleus like an atomic fission diagram."
SUBJECTS[mission-control]="An atomic-era mission operations console seen from a low 3/4 angle — a curved horseshoe command arc dense with circular dials, oscilloscope screens, toggle-switch banks, and patch-panel jacks rendered as atomic-age instrument clusters. Vacuum-tube readout columns bracket the flanks. Signal paths between stations arc as parabolic trajectory vectors across the console face, the whole nerve-center composed as a NASA Launch Control photograph."
SUBJECTS[deep-codebase]="A vertical cross-section of geological strata, each layer labeled as a codebase abstraction — UI, logic, data, infra — plotted with survey-line and altitude-marking precision."
SUBJECTS[mc-vault]="A vast branching note-network rendered as a molecular lattice — each node a vault page with orbital annotation rings, connected by NLP-derived link vectors radiating from a central knowledge core. Automation service threads trace the periphery as signal paths feeding data from external sources, like a neural observatory continuously updating its star charts and cross-referencing 1,900 nodes."
SUBJECTS[lmc-voice]="A circular voice aperture seen head-on — concentric rings of audio signal expanding outward, each ring a distinct processing stage. Four agent nodes orbit the outer ring on elliptical satellite paths. Frequency-spectrum tick marks radiate inward as spokes, the whole diagram rendered as a stellar radio-observatory readout plotted on a coordinate grid."
SUBJECTS[swan]="A swan silhouette whose long neck is a single CLI process node; the wings decompose into four distinct Celery queue lanes — each a branching trajectory arc. BAML contract medallions punctuate the junction points between orchestration and execution. Concentric Redis orbital rings expand outward from the distributed graph as shared-state shells, the whole system rendered as an atomic diagram of distributed cognition."
SUBJECTS[untie-ai]="A radial influence map viewed from above — concentric tactical zones expanding from a central origin point, each ring scored by strategic advantage. Response curve arcs sweep outward as parabolic trajectory lines, one arc per decision option. The composition reads as a battle-planning overlay atop an atomic-age target-ring diagram with altitude-calibration coordinates and radial propagation rings."
SUBJECTS[blubry]="A cross-section of a 3.5mm TRRS plug bisected lengthwise — four conductor rings rendered as atomic-shell bands, each ring a separate signal channel. On one side: the silhouette of a smartphone; on the other: PCB traces and component footprints branching outward like atomic bonds. The jack is the sole junction point between two worlds, rendered as a technical assembly diagram etched on a coordinate grid."
SUBJECTS[dotfiles]="A dense grid of terminal glyphs and config keys arranged in a molecular lattice, each character rendered as a circuit node, columns and rows locked to a coordinate-cross grid."
SUBJECTS[untie-animation]="A humanoid figure silhouette bisected vertically — the left half shows AI decision nodes emitting named action signals as emission lines; the right half shows independent animation layer stacks (upper body, lower body) blending from velocity vectors. Predictive deceleration arcs curve from pathfinding nodes to motion-completion gate rings, all plotted on a waveform-calibration grid with hot-swap configuration medallions at layer boundaries."

PROJECT="${1:-all}"

if [[ "$PROJECT" == "all" ]]; then
  first=true
  for key in $(echo "${!SUBJECTS[@]}" | tr ' ' '\n' | sort); do
    [[ "$first" == "true" ]] || printf '\n---\n\n'
    echo "${STYLE} Subject: ${SUBJECTS[$key]}"
    first=false
  done
  exit 0
fi

if [[ -z "${SUBJECTS[$PROJECT]:-}" ]]; then
  echo "Unknown project: $PROJECT"
  echo ""
  echo "Available projects:"
  for key in "${!SUBJECTS[@]}"; do
    echo "  $key"
  done | sort
  exit 1
fi

echo "${STYLE} Subject: ${SUBJECTS[$PROJECT]}"
