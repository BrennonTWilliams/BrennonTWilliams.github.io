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
SUBJECTS[untie-animation]="A humanoid figure built from connected bone segments — pelvis, spine, limbs rendered as cylindrical rods joined at pivot-sphere nodes — caught in a dynamic mid-stride running pose: torso leaning sharply forward, one knee driving upward at an acute angle, the opposite arm swinging back, both elbows bent. The rig dominates the upper composition mass, floating above a horizontal animation timeline strip in the lower third — keyframe diamonds and interpolation spline curves plotted along the baseline. Motion arcs sweep from each limb joint as parabolic trajectory lines; velocity vectors and bearing-calibration brackets annotate the stride, all rendered as a biomechanical engineering diagram on a surveyor's coordinate grid."

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
