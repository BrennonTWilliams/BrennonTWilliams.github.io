# Project Art Cover Style

## Master Style: Atomic Constructivist Relief Print

> Base style applied to every project cover. Combine with a subject block below.

High-contrast relief print on aged cotton rag paper, fusing Soviet Constructivist poster dynamism with mid-century American atomic-age and NASA space-program aesthetics — no Soviet iconography, purely the graphic grammar. Bold diagonal compositions cleave the picture plane: Rodchenko-style blocked geometric forms colliding with NASA mission-diagram precision. Electron-orbit rings, parabolic trajectory arcs, celestial coordinate grids, and atomic shell diagrams carved as crisp relief lines layer over the subject. Dynamic diagonal tension throughout — compositions tilt and thrust rather than center and settle. Subject rendered as the dominant mass of a high-energy diagonal layout, surrounded by radiating atomic-age technical geometry: orbital shells, electron node paths, mission-patch medallion borders, altitude-marking tick lines, and molecular lattice fragments. Carbon-black ink floods bold blocked negative forms while razor-thin relief lines trace technical diagram overlays — instrument gradations, trajectory parabolas, stellar coordinate crosses, and radioactive-wave ornament used purely decoratively. Deliberate ink pooling at form edges, slight over-bite at carved corners, craft imperfections that signal hand-cut origin. Rich matte texture, visible paper grain beneath the ink. Palette: carbon-black ink on warm bone ground, single accent of deep vermillion for focal geometric emphasis. No gradients. No smooth digital vectors. No Asian script or characters. No hammers, Soviet stars, or wheat. Pure mid-century American atomic-optimist relief print. Portrait format, 5:7 aspect ratio, dynamic asymmetric border.

---

## Per-Project Subject Blocks

Append one of these after the master style, or write your own subject line in the same format.

**little-loops**
Subject: A recursive ouroboros of looping arrows encircling a grid of numbered issue tickets and sprint cards, with FSM state-transition nodes branching outward like electron paths.

**claude-loop**
Subject: A single autonomous agent arrow looping back on itself, surrounded by concentric orbital rings of decision nodes and branching task trees, like an atomic diagram of machine cognition.

**blender-agents**
Subject: A Blender viewport grid viewed at oblique angle — geometric mesh primitives (sphere, cube, armature skeleton) anchored in the lower mass, their wireframe edges dissolving upward into an OODA loop orchestration graph. Agent decision nodes at each loop phase (Observe, Orient, Decide, Act) orbit the scene like electron shells, connected by bold trajectory vectors to the 3D tool operations below.

**graphrag-claude-code**
Subject: An exploded knowledge graph — nodes as orbital junction points, edges as trajectory vectors — radiating outward from a central document nucleus like an atomic fission diagram.

**mission-control**
Subject: A top-down blueprint of a homelab rack and network diagram — server nodes, DNS zones, and service containers rendered as instrument clusters and atomic-shell diagrams on a coordinate grid. Config-file stacks run as altitude-calibration tick columns flanking the composition. Signal paths between services arc as parabolic trajectory vectors, the whole infrastructure map composed as a mission operations schematic.

**deep-codebase**
Subject: A vertical cross-section of geological strata, each layer labeled as a codebase abstraction — UI, logic, data, infra — plotted with survey-line and altitude-marking precision.

**mc-vault**
Subject: A vast branching note-network rendered as a molecular lattice — each node a vault page with orbital annotation rings, connected by NLP-derived link vectors radiating from a central knowledge core. Automation service threads trace the periphery as signal paths feeding data from external sources, like a neural observatory continuously updating its star charts and cross-referencing 1,900 nodes.

**lmc-voice**
Subject: A vertical instrument stack — WebRTC audio waveform at the crown feeds downward through a VAD gate envelope, a phoneme-lattice speech-to-text layer, a streaming neural core with BAML contract medallions, and a synthesized waveform at the base. Four observer agent nodes orbit the central pipeline column on electron-shell paths. The full chain rendered as a mission-critical telemetry rack on a coordinate-lined test bench.

**swan**
Subject: A swan silhouette whose long neck is a single CLI process node; the wings decompose into four distinct Celery queue lanes — each a branching trajectory arc. BAML contract medallions punctuate the junction points between orchestration and execution. Concentric Redis orbital rings expand outward from the distributed graph as shared-state shells, the whole system rendered as an atomic diagram of distributed cognition.

**untie-ai**
Subject: A radiating decision-lattice descending from a central AIBrain node through tiers of Behavior, Reasoner, Option, and Consideration — each layer an orbital shell. Response curves (logistic, parabolic, sine arcs) flank the hierarchy as trajectory geometry. A spatial influence grid overlays the lower quadrant as altitude-calibration coordinates mapping zones of tactical advantage, with radial influence-propagation rings emanating from faction-origin points.

**blubry**
Subject: A cross-section of a 3.5mm TRRS plug bisected lengthwise — four conductor rings rendered as atomic-shell bands, each ring a separate signal channel. On one side: the silhouette of a smartphone; on the other: PCB traces and component footprints branching outward like atomic bonds. The jack is the sole junction point between two worlds, rendered as a technical assembly diagram etched on a coordinate grid.

**dotfiles**
Subject: A dense grid of terminal glyphs and config keys arranged in a molecular lattice, each character rendered as a circuit node, columns and rows locked to a coordinate-cross grid.

**untie-animation**
Subject: A humanoid figure silhouette bisected vertically — the left half shows AI decision nodes emitting named action signals as emission lines; the right half shows independent animation layer stacks (upper body, lower body) blending from velocity vectors. Predictive deceleration arcs curve from pathfinding nodes to motion-completion gate rings, all plotted on a waveform-calibration grid with hot-swap configuration medallions at layer boundaries.

---

## Usage Script

Run `./gen-prompt.sh <project-slug>` to print the full ready-to-paste prompt.

```bash
#!/opt/homebrew/bin/bash
# gen-prompt.sh — print a ready-to-paste image gen prompt for a project cover
set -euo pipefail

STYLE="Bold two-color linocut poster print on aged bone-white cotton rag paper, fusing 1950s–60s NASA mission-program graphic design with Soviet Constructivist composition — no Soviet iconography, purely the graphic grammar. COMPOSITION: asymmetric diagonal thrust, dominant subject mass pushed off-center toward the upper or lower two-thirds, never bilaterally symmetric — dynamic tilt and lean like a Constructivist broadside. FORMS: large flat carbon-black silhouette blocks anchor the composition; fine razor-thin carved relief lines overlay atomic-age technical diagrams floating across the blocked forms — electron orbital rings with dot-nodes on the paths, parabolic re-entry trajectory arcs, molecular bond lattices, altitude-calibration tick marks, stellar coordinate crosshairs, and mission-patch medallion rings as secondary geometry. TEXTURE: visible ink over-bite at carved block edges, paper grain beneath ink, slight tonal variation within flat areas from uneven press — pure hand-cut print character. PALETTE: carbon-black ink on warm bone/cream ground, single focal element in deep vermillion only. EXPLICIT PROHIBITIONS: no bilateral symmetry, no decorative fan borders, no scallop ornament, no stepped chevron frames, no Art Deco ornament, no Asian characters, no hammers or Soviet stars. Portrait 5:7 aspect ratio."

declare -A SUBJECTS
SUBJECTS[little-loops]="A recursive ouroboros of looping arrows encircling a grid of numbered issue tickets and sprint cards, with FSM state-transition nodes branching outward like electron paths."
SUBJECTS[claude-loop]="A single autonomous agent arrow looping back on itself, surrounded by concentric orbital rings of decision nodes and branching task trees, like an atomic diagram of machine cognition."
SUBJECTS[blender-agents]="A 3D mesh wireframe hand dissolving into an orchestration graph, polygons becoming agent nodes connected by bold trajectory vectors."
SUBJECTS[graphrag-claude-code]="An exploded knowledge graph — nodes as orbital junction points, edges as trajectory vectors — radiating outward from a central document nucleus like an atomic fission diagram."
SUBJECTS[mission-control]="A cockpit instrument panel viewed from above, dials and gauges rendered as atomic-age instrument clusters and waveform readouts, command lines etched as coordinate-grid overlays."
SUBJECTS[deep-codebase]="A vertical cross-section of geological strata, each layer labeled as a codebase abstraction — UI, logic, data, infra — plotted with survey-line and altitude-marking precision."
SUBJECTS[mc-vault]="An open strongbox with Minecraft pixel-block silhouettes stacked inside, surrounded by radial lock-mechanism and orbital-shell diagrams."
SUBJECTS[lmc-voice]="A sound wave cross-sectioned into anatomical layers, speech phonemes etched as waveform slices radiating from a central vocal-cord glyph, overlaid with frequency-spectrum tick marks."
SUBJECTS[swan]="A swan in mid-dive, feathers dissolving into circuit traces and trajectory lines, elegant neck forming the spine of a data-flow diagram plotted on a celestial coordinate grid."
SUBJECTS[untie-ai]="A tightly knotted rope rendered in macro-detail, strands separating and re-routing into clean parallel signal paths, with molecular bond diagrams at each junction point."
SUBJECTS[blubry]="A podcast microphone dissected in cross-section, internal capsule rendered as a radial circuit diagram, soundwaves carved in concentric rings outward like atomic emission lines."
SUBJECTS[dotfiles]="A dense grid of terminal glyphs and config keys arranged in a molecular lattice, each character rendered as a circuit node, columns and rows locked to a coordinate-cross grid."

PROJECT="${1:-}"

if [[ -z "$PROJECT" ]]; then
  echo "Usage: $0 <project-slug>"
  echo "Available: ${!SUBJECTS[*]}"
  exit 1
fi

if [[ -z "${SUBJECTS[$PROJECT]:-}" ]]; then
  echo "Unknown project: $PROJECT"
  echo "Available: ${!SUBJECTS[*]}"
  exit 1
fi

echo "${STYLE} Subject: ${SUBJECTS[$PROJECT]}"
```
