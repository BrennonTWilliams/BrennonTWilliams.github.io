# Project Art Cover Style

## Master Style: Atomic Constructivist Relief Print

> Base style applied to every project cover. Combine with a subject block below.

High-contrast relief print on aged cotton rag paper, fusing Soviet Constructivist poster dynamism with mid-century American atomic-age and NASA space-program aesthetics — no Soviet iconography, purely the graphic grammar. Bold diagonal compositions cleave the picture plane: Rodchenko-style blocked geometric forms colliding with NASA mission-diagram precision. Electron-orbit rings, parabolic trajectory arcs, celestial coordinate grids, and atomic shell diagrams carved as crisp relief lines layer over the subject. Dynamic diagonal tension throughout — compositions tilt and thrust rather than center and settle. Subject rendered as the dominant mass of a high-energy diagonal layout, surrounded by radiating atomic-age technical geometry: orbital shells, electron node paths, mission-patch medallion borders, altitude-marking tick lines, and molecular lattice fragments. Carbon-black ink floods bold blocked negative forms while razor-thin relief lines trace technical diagram overlays — instrument gradations, trajectory parabolas, stellar coordinate crosses, and radioactive-wave ornament used purely decoratively. Deliberate ink pooling at form edges, slight over-bite at carved corners, craft imperfections that signal hand-cut origin. Rich matte texture, visible paper grain beneath the ink. Palette: carbon-black ink on warm bone ground, single accent of deep vermillion for focal geometric emphasis. No gradients. No smooth digital vectors. No text, letters, numerals, or words anywhere in the image. No nuclear or atomic imagery. No Asian script or characters. No hammers, Soviet stars, or wheat. Pure mid-century American mission-program relief print. Portrait format, 5:7 aspect ratio, dynamic asymmetric border.

---

## Per-Project Subject Blocks

Append one of these after the master style, or write your own subject line in the same format.

**little-loops**
Subject: A precision clock escapement mechanism cross-sectioned in oblique side view — a large driving gear engages a ratchet wheel through a pivoting anchor lever, the whole system caught mid-motion. Smaller satellite gears extend outward in a cascade, each wheel a distinct phase of an automated cycle. The mechanism is rendered as an engineering diagram on a surveyor's grid, spring-tension lines and bearing-point marks annotating each pivot.

**claude-loop**
Subject: A precision gyroscope in mid-spin — the rotor ring tilted at a dynamic angle on its gimbal axis, its precession path traced as a sweeping elliptical arc across the picture plane. The inner rotor is a bold circular silhouette; the outer gimbal rings are rendered as thin precision bearings. The whole instrument floats against the bone ground as if photographed in a physics laboratory, gimbal pivot points marked with calibration brackets.

**blender-agents**
Subject: A 3D viewport grid viewed at oblique angle — geometric mesh primitives anchored in the lower mass, their wireframe edges dissolving upward into a four-phase autonomous loop orchestration graph. Agent decision nodes orbit the scene at each loop phase, connected by bold trajectory vectors to the 3D tool operations below.

**graphrag-claude-code**
Subject: A river delta viewed from directly above — a single source channel at the upper mass branching into spreading tributaries that pool into distinct settlement basins. Each basin is a cluster of nodes rendered as survey-map settlement marks. The delta is overlaid with cartographic contour lines, bearing-cross annotations, and altitude-hatch lines, the whole landscape rendered as a geographic reconnaissance plan.

**mission-control**
Subject: A mid-century mission operations console seen from a low 3/4 angle — a curved horseshoe command arc dense with circular dials, oscilloscope screens, toggle-switch banks, and patch-panel jacks rendered as mid-century instrument clusters. Vacuum-tube readout columns bracket the flanks. Signal paths between stations arc as parabolic trajectory vectors across the console face, the whole nerve-center composed as a NASA Launch Control photograph.

**deep-codebase**
Subject: A vertical cross-section of geological strata — four distinct codebase abstraction bands from surface to bedrock — plotted with survey-line and altitude-marking precision.

**mc-vault**
Subject: A vast branching note-network rendered as a structural lattice — each node a vault page with bearing annotation rings, connected by link vectors radiating from a central knowledge core. Automation service threads trace the periphery as signal paths feeding data from external sources, like a signal observatory continuously updating its star charts and cross-referencing 1,900 nodes.

**lmc-voice**
Subject: A gramophone horn seen from a low 3/4 angle — the wide bell mouth aimed diagonally upward-left, its curved throat tapering steeply to the lower right. Bold parallel wave crests radiate outward from the bell as sweeping arcs. The horn's cross-sectioned interior reveals a parabolic reflector surface with survey-ring calibration marks. A stark diagonal silhouette dominating the picture plane.

**swan**
Subject: A swan silhouette whose long neck is a single process node; the wings decompose into four distinct task queue lanes — each a branching trajectory arc. Geometric contract medallions punctuate the junction points between orchestration and execution. Concentric state-store rings expand outward from the distributed graph as shared-state shells, the whole system rendered as a distributed system schematic.

**untie-ai**
Subject: A radial influence map viewed from above — concentric tactical zones expanding from a central origin point, each ring scored by strategic advantage. Response curve arcs sweep outward as parabolic trajectory lines, one arc per decision option. The composition reads as a battle-planning overlay atop a mid-century target-ring diagram with altitude-calibration coordinates and radial propagation rings.

**blubry**
Subject: A cross-section of a four-ring audio plug bisected lengthwise — four conductor rings rendered as layered band segments, each ring a separate signal channel. On one side: the silhouette of a smartphone; on the other: PCB traces and component footprints branching outward like circuit connections. The plug is the sole junction point between two worlds, rendered as a technical assembly diagram etched on a coordinate grid.

**dotfiles**
Subject: A multitool with all implements extended in a bold diagonal fan — each blade, file, and tool a distinct abstract silhouette shape radiating from a central precision pivot. The pivot bears calibration marks. The fanned implements spread diagonally across the picture plane in a dynamic asymmetric arc, rendered as an engineer's exploded-view technical diagram on a surveyor's grid.

**untie-animation**
Subject: A humanoid figure silhouette bisected vertically — the left half shows AI decision nodes emitting action signals as emission lines; the right half shows two independent animation layer stacks blending from velocity vectors. Predictive deceleration arcs curve from pathfinding nodes to motion-completion gate rings, all plotted on a waveform-calibration grid with configuration medallions at layer boundaries.

---

## Usage Script

Run `./gen-prompt.sh <project-slug>` to print the full ready-to-paste prompt. Run `./gen-prompt.sh all` to print all prompts separated by `---`.

```bash
#!/opt/homebrew/bin/bash
# gen-prompt.sh — print a ready-to-paste image gen prompt for a project cover
set -euo pipefail

STYLE="Bold two-color linocut poster print on aged bone-white cotton rag paper, fusing 1950s–60s NASA mission-program graphic design with Soviet Constructivist composition — no Soviet iconography, purely the graphic grammar. COMPOSITION: asymmetric diagonal thrust, dominant subject mass pushed off-center toward the upper or lower two-thirds, never bilaterally symmetric — dynamic tilt and lean like a Constructivist broadside. FORMS: large flat carbon-black silhouette blocks anchor the composition; fine razor-thin carved relief lines overlay mid-century technical diagrams floating across the blocked forms — compass bearing rings, parabolic trajectory arcs, structural lattice grids, altitude-calibration tick marks, survey coordinate crosshairs, and mission-patch medallion rings as secondary geometry. TEXTURE: visible ink over-bite at carved block edges, paper grain beneath ink, slight tonal variation within flat areas from uneven press — pure hand-cut print character. PALETTE: carbon-black ink on warm bone/cream ground, single focal element in deep vermillion only. EXPLICIT PROHIBITIONS: no text, no letters, no numerals, no words anywhere in the image; no bilateral symmetry, no decorative fan borders, no scallop ornament, no stepped chevron frames, no Art Deco ornament, no Asian characters, no hammers or Soviet stars. Portrait 5:7 aspect ratio."

declare -A SUBJECTS
SUBJECTS[little-loops]="A precision clock escapement mechanism cross-sectioned in oblique side view — a large driving gear engages a ratchet wheel through a pivoting anchor lever, the whole system caught mid-motion. Smaller satellite gears extend outward in a cascade, each wheel a distinct phase of an automated cycle. The mechanism is rendered as an engineering diagram on a surveyor's grid, spring-tension lines and bearing-point marks annotating each pivot."
SUBJECTS[claude-loop]="A precision gyroscope in mid-spin — the rotor ring tilted at a dynamic angle on its gimbal axis, its precession path traced as a sweeping elliptical arc across the picture plane. The inner rotor is a bold circular silhouette; the outer gimbal rings are rendered as thin precision bearings. The whole instrument floats against the bone ground as if photographed in a physics laboratory, gimbal pivot points marked with calibration brackets."
SUBJECTS[blender-agents]="A 3D viewport grid viewed at oblique angle — geometric mesh primitives anchored in the lower mass, their wireframe edges dissolving upward into a four-phase autonomous loop orchestration graph. Agent decision nodes orbit the scene at each loop phase, connected by bold trajectory vectors to the 3D tool operations below."
SUBJECTS[graphrag-claude-code]="A river delta viewed from directly above — a single source channel at the upper mass branching into spreading tributaries that pool into distinct settlement basins. Each basin is a cluster of nodes rendered as survey-map settlement marks. The delta is overlaid with cartographic contour lines, bearing-cross annotations, and altitude-hatch lines, the whole landscape rendered as a geographic reconnaissance plan."
SUBJECTS[mission-control]="A mid-century mission operations console seen from a low 3/4 angle — a curved horseshoe command arc dense with circular dials, oscilloscope screens, toggle-switch banks, and patch-panel jacks rendered as mid-century instrument clusters. Vacuum-tube readout columns bracket the flanks. Signal paths between stations arc as parabolic trajectory vectors across the console face, the whole nerve-center composed as a NASA Launch Control photograph."
SUBJECTS[deep-codebase]="A vertical cross-section of geological strata — four distinct codebase abstraction bands from surface to bedrock — plotted with survey-line and altitude-marking precision."
SUBJECTS[mc-vault]="A vast branching note-network rendered as a structural lattice — each node a vault page with bearing annotation rings, connected by link vectors radiating from a central knowledge core. Automation service threads trace the periphery as signal paths feeding data from external sources, like a signal observatory continuously updating its star charts and cross-referencing 1,900 nodes."
SUBJECTS[lmc-voice]="A gramophone horn seen from a low 3/4 angle — the wide bell mouth aimed diagonally upward-left, its curved throat tapering steeply to the lower right. Bold parallel wave crests radiate outward from the bell as sweeping arcs. The horn's cross-sectioned interior reveals a parabolic reflector surface with survey-ring calibration marks. A stark diagonal silhouette dominating the picture plane."
SUBJECTS[swan]="A swan silhouette whose long neck is a single process node; the wings decompose into four distinct task queue lanes — each a branching trajectory arc. Geometric contract medallions punctuate the junction points between orchestration and execution. Concentric state-store rings expand outward from the distributed graph as shared-state shells, the whole system rendered as a distributed system schematic."
SUBJECTS[untie-ai]="A radial influence map viewed from above — concentric tactical zones expanding from a central origin point, each ring scored by strategic advantage. Response curve arcs sweep outward as parabolic trajectory lines, one arc per decision option. The composition reads as a battle-planning overlay atop a mid-century target-ring diagram with altitude-calibration coordinates and radial propagation rings."
SUBJECTS[blubry]="A cross-section of a four-ring audio plug bisected lengthwise — four conductor rings rendered as layered band segments, each ring a separate signal channel. On one side: the silhouette of a smartphone; on the other: PCB traces and component footprints branching outward like circuit connections. The plug is the sole junction point between two worlds, rendered as a technical assembly diagram etched on a coordinate grid."
SUBJECTS[dotfiles]="A multitool with all implements extended in a bold diagonal fan — each blade, file, and tool a distinct abstract silhouette shape radiating from a central precision pivot. The pivot bears calibration marks. The fanned implements spread diagonally across the picture plane in a dynamic asymmetric arc, rendered as an engineer's exploded-view technical diagram on a surveyor's grid."
SUBJECTS[untie-animation]="A humanoid figure silhouette bisected vertically — the left half shows AI decision nodes emitting action signals as emission lines; the right half shows two independent animation layer stacks blending from velocity vectors. Predictive deceleration arcs curve from pathfinding nodes to motion-completion gate rings, all plotted on a waveform-calibration grid with configuration medallions at layer boundaries."

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
```
