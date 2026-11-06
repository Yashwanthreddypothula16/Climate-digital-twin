"""Generates publication-quality circuit diagrams (PNG, SVG, and text representations)
for the actual VQC and QSVM quantum models implemented in backend/ml_service.py.
Output directory: docs/quantum_circuits/
"""

import os
import sys
from pathlib import Path

# Suppress matplotlib font cache warnings & point to writable directory
ROOT_DIR = Path(__file__).resolve().parent.parent
os.environ["MPLCONFIGDIR"] = str(Path(__file__).parent / ".mplconfig")

import numpy as np
import joblib
import pennylane as qml
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Ensure output directory exists
OUT_DIR = ROOT_DIR / "docs" / "quantum_circuits"
OUT_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR = ROOT_DIR / "backend" / "models"

# 4 Qubits matching backend/ml_service.py
N_QUBITS = 4
q_device = qml.device("default.qubit", wires=N_QUBITS)


# ─────────────────────────────────────────────────────────────────────────────
# 1. ACTUAL QUANTUM CIRCUIT DEFINITIONS (FROM backend/ml_service.py)
# ─────────────────────────────────────────────────────────────────────────────

@qml.qnode(q_device)
def vqc_full_circuit(weights, features):
    """Actual VQC circuit from backend/ml_service.py line 66-79."""
    qml.AngleEmbedding(features, wires=range(N_QUBITS), rotation='Z')
    n_layers = weights.shape[0]
    for layer in range(n_layers):
        for i in range(N_QUBITS):
            qml.RY(weights[layer, i, 0], wires=i)
            qml.RZ(weights[layer, i, 1], wires=i)
        for i in range(N_QUBITS - 1):
            qml.CNOT(wires=[i, i + 1])
        qml.CNOT(wires=[N_QUBITS - 1, 0])
    return [qml.expval(qml.PauliZ(i)) for i in range(N_QUBITS)]


@qml.qnode(q_device)
def vqc_feature_map(features):
    """VQC feature encoding map: AngleEmbedding(features, rotation='Z')."""
    qml.AngleEmbedding(features, wires=range(N_QUBITS), rotation='Z')
    return [qml.expval(qml.PauliZ(i)) for i in range(N_QUBITS)]


@qml.qnode(q_device)
def vqc_ansatz(weights):
    """VQC variational ansatz: 2 layers of RY/RZ and cyclic ring CNOTs."""
    n_layers = weights.shape[0]
    for layer in range(n_layers):
        for i in range(N_QUBITS):
            qml.RY(weights[layer, i, 0], wires=i)
            qml.RZ(weights[layer, i, 1], wires=i)
        for i in range(N_QUBITS - 1):
            qml.CNOT(wires=[i, i + 1])
        qml.CNOT(wires=[N_QUBITS - 1, 0])
    return [qml.expval(qml.PauliZ(i)) for i in range(N_QUBITS)]


@qml.qnode(q_device)
def qsvm_feature_map(features):
    """QSVM feature encoding map: AngleEmbedding(features, rotation='Y') + linear CNOT ladder."""
    qml.AngleEmbedding(features, wires=range(N_QUBITS), rotation='Y')
    for i in range(N_QUBITS - 1):
        qml.CNOT(wires=[i, i + 1])
    return [qml.expval(qml.PauliZ(i)) for i in range(N_QUBITS)]


@qml.qnode(q_device)
def qsvm_kernel_circuit(x1, x2):
    """Actual QSVM quantum kernel circuit from backend/ml_service.py line 48-63."""
    # State preparation for x1
    qml.AngleEmbedding(x1, wires=range(N_QUBITS), rotation='Y')
    for i in range(N_QUBITS - 1):
        qml.CNOT(wires=[i, i + 1])
    
    # Adjoint state preparation for x2
    qml.adjoint(
        lambda: (
            [qml.CNOT(wires=[i, i + 1]) for i in reversed(range(N_QUBITS - 1))],
            qml.AngleEmbedding(x2, wires=range(N_QUBITS), rotation='Y')
        )
    )()
    return qml.probs(wires=range(N_QUBITS))


# ─────────────────────────────────────────────────────────────────────────────
# 2. DIAGRAM GENERATOR
# ─────────────────────────────────────────────────────────────────────────────

def save_diagram(fig, base_name: str, title: str, subtitle: str = ""):
    """Saves figure in both high-res PNG (300 DPI) and scalable vector SVG."""
    # Add title and styling
    fig.suptitle(title, fontsize=13, fontweight='bold', y=0.98, color='#0f172a')
    if subtitle:
        fig.text(0.5, 0.92, subtitle, ha='center', fontsize=9, color='#475569', style='italic')
    
    png_path = OUT_DIR / f"{base_name}.png"
    svg_path = OUT_DIR / f"{base_name}.svg"
    
    fig.savefig(png_path, dpi=300, bbox_inches='tight', facecolor='white', edgecolor='none')
    fig.savefig(svg_path, bbox_inches='tight', facecolor='white', edgecolor='none')
    plt.close(fig)
    print(f"  [+] Saved {png_path.name} ({png_path.stat().st_size // 1024} KB)")
    print(f"  [+] Saved {svg_path.name} ({svg_path.stat().st_size // 1024} KB)")


def generate_all_diagrams():
    print("=" * 70)
    print("QUANTUM CIRCUIT DIAGRAM GENERATOR")
    print(f"Target Directory: {OUT_DIR}")
    print("=" * 70)

    # 1. Load trained artifacts
    weights_path = MODELS_DIR / "vqc_weights.npy"
    scaler_path = MODELS_DIR / "q_scaler.joblib"

    if weights_path.exists():
        vqc_weights = np.load(weights_path)
        print(f"Loaded actual VQC weights from {weights_path} with shape {vqc_weights.shape}")
    else:
        print("Warning: vqc_weights.npy not found, using pre-set seed weights.")
        np.random.seed(42)
        vqc_weights = np.random.uniform(0.1, 1.2, size=(2, N_QUBITS, 2))

    if scaler_path.exists():
        q_scaler = joblib.load(scaler_path)
        print(f"Loaded actual MinMaxScaler from {scaler_path}")
    else:
        q_scaler = None

    # Realistic Telangana climate feature inputs:
    # Feature 0: Temp (°C), Feature 1: Humidity (%), Feature 2: Wind (km/h), Feature 3: Rainfall (mm)
    raw_sample_base = np.array([[31.5, 62.0, 14.5, 2.5]])  # Baseline weather
    raw_sample_sim = np.array([[36.8, 78.0, 26.0, 52.0]])  # Simulated extreme scenario

    if q_scaler is not None:
        features_base = q_scaler.transform(raw_sample_base)[0]
        features_sim = q_scaler.transform(raw_sample_sim)[0]
    else:
        features_base = np.array([1.25, 1.95, 0.85, 0.40])
        features_sim = np.array([2.10, 2.55, 1.60, 2.80])

    print("\nFeature Angle Encoding ([0, pi] rad):")
    feature_names = ["q0 (Temperature)", "q1 (Rel Humidity)", "q2 (Wind Speed)", "q3 (Rainfall 24h)"]
    for i, name in enumerate(feature_names):
        print(f"  {name}: {features_base[i]:.3f} rad (raw: {raw_sample_base[0, i]})")

    # ─────────────────────────────────────────────────────────────────────────
    # 1. VQC ACTUAL COMBINED CIRCUIT
    # ─────────────────────────────────────────────────────────────────────────
    print("\n1. Generating VQC Actual Circuit Diagram...")
    fig, ax = qml.draw_mpl(vqc_full_circuit, style="pennylane", decimals=2)(vqc_weights, features_base)
    save_diagram(
        fig,
        "vqc_actual_circuit",
        "Variational Quantum Classifier (VQC) — Complete Circuit Architecture",
        "AngleEmbedding(Z) [Features x0..x3] + 2 Variational Layers [RY/RZ + Ring CNOTs] + Pauli-Z Measurements"
    )

    # Save text drawing (both top-level and decomposed)
    txt_vqc = qml.draw(vqc_full_circuit, decimals=2)(vqc_weights, features_base)
    txt_vqc_dev = qml.draw(vqc_full_circuit, level="device", decimals=2)(vqc_weights, features_base)
    vqc_txt_path = OUT_DIR / "vqc_actual_circuit.txt"
    with open(vqc_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("VARIATIONAL QUANTUM CLASSIFIER (VQC) — ACTUAL PENNYLANE CIRCUIT\n")
        f.write(f"Source: backend/ml_service.py (_vqc_circuit)\n")
        f.write(f"Parameters: backend/models/vqc_weights.npy (shape: {vqc_weights.shape})\n")
        f.write("Qubit-to-Feature Mapping:\n")
        for i, name in enumerate(feature_names):
            f.write(f"  Wire {i}: {name} = {features_base[i]:.4f} rad\n")
        f.write("=" * 80 + "\n\n")
        f.write("--- High-Level Circuit Drawing ---\n")
        f.write(txt_vqc + "\n\n")
        f.write("--- Decomposed Gate-Level Execution (Elementary Gates) ---\n")
        f.write(txt_vqc_dev + "\n\n")
        f.write("--- Trainable Parameter Matrix (Layer x Qubit x [RY, RZ]) ---\n")
        for l in range(vqc_weights.shape[0]):
            f.write(f"Layer {l}:\n")
            for q in range(N_QUBITS):
                f.write(f"  q{q}: RY(theta={vqc_weights[l, q, 0]:.4f}), RZ(phi={vqc_weights[l, q, 1]:.4f})\n")
    print(f"  [+] Saved {vqc_txt_path.name}")

    # ─────────────────────────────────────────────────────────────────────────
    # 2. VQC FEATURE MAP ALONE
    # ─────────────────────────────────────────────────────────────────────────
    print("\n2. Generating VQC Feature Map Diagram...")
    fig, ax = qml.draw_mpl(vqc_feature_map, style="pennylane", decimals=2, level="device")(features_base)
    save_diagram(
        fig,
        "vqc_feature_map",
        "VQC Quantum Feature Map — Z-Rotation Angle Embedding",
        "Encodes 4 climate features into single-qubit rotations: RZ(x_i) on wire i"
    )

    txt_vqc_fm = qml.draw(vqc_feature_map, level="device", decimals=2)(features_base)
    vqc_fm_txt_path = OUT_DIR / "vqc_feature_map.txt"
    with open(vqc_fm_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("VQC QUANTUM FEATURE MAP\n")
        f.write("Type: qml.AngleEmbedding(features, wires=range(4), rotation='Z')\n")
        f.write("Encodes scaled climate features [temp, hum, wind, rain] as Pauli-Z rotations.\n")
        f.write("=" * 80 + "\n\n")
        f.write(txt_vqc_fm + "\n")
    print(f"  [+] Saved {vqc_fm_txt_path.name}")

    # ─────────────────────────────────────────────────────────────────────────
    # 3. VQC ANSATZ ALONE
    # ─────────────────────────────────────────────────────────────────────────
    print("\n3. Generating VQC Variational Ansatz Diagram...")
    fig, ax = qml.draw_mpl(vqc_ansatz, style="pennylane", decimals=2)(vqc_weights)
    save_diagram(
        fig,
        "vqc_ansatz",
        "VQC Variational Ansatz — Parameterized Rotations & Ring Entanglement",
        "2 Layers | 16 Trainable Parameters | RY(theta) + RZ(phi) + Cyclic CNOT Ring Topology"
    )

    txt_vqc_ans = qml.draw(vqc_ansatz, decimals=2)(vqc_weights)
    vqc_ans_txt_path = OUT_DIR / "vqc_ansatz.txt"
    with open(vqc_ans_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("VQC VARIATIONAL ANSATZ\n")
        f.write("Architecture: 2 Layers of parameterized RY/RZ rotations with cyclic ring CNOTs\n")
        f.write("Entanglement Topology: Ring (0->1, 1->2, 2->3, 3->0)\n")
        f.write("Trainable Parameters: 16 weights in backend/models/vqc_weights.npy\n")
        f.write("=" * 80 + "\n\n")
        f.write(txt_vqc_ans + "\n")
    print(f"  [+] Saved {vqc_ans_txt_path.name}")

    # ─────────────────────────────────────────────────────────────────────────
    # 4. QSVM FEATURE MAP ALONE
    # ─────────────────────────────────────────────────────────────────────────
    print("\n4. Generating QSVM Feature Map Diagram...")
    fig, ax = qml.draw_mpl(qsvm_feature_map, style="pennylane", decimals=2, level="device")(features_base)
    save_diagram(
        fig,
        "qsvm_feature_map",
        "QSVM Quantum Feature Map — Y-Rotation Angle Embedding + Linear Entangler",
        "Encodes climate vector via RY(x_i) followed by linear nearest-neighbor CNOT ladder"
    )

    txt_qsvm_fm = qml.draw(qsvm_feature_map, level="device", decimals=2)(features_base)
    qsvm_fm_txt_path = OUT_DIR / "qsvm_feature_map.txt"
    with open(qsvm_fm_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("QSVM QUANTUM FEATURE MAP U(x)\n")
        f.write("Operations: AngleEmbedding(rotation='Y') + Linear CNOT Ladder [0->1, 1->2, 2->3]\n")
        f.write("Prepares quantum state |phi(x)> = U(x)|0000>\n")
        f.write("=" * 80 + "\n\n")
        f.write(txt_qsvm_fm + "\n")
    print(f"  [+] Saved {qsvm_fm_txt_path.name}")

    # ─────────────────────────────────────────────────────────────────────────
    # 5. QSVM QUANTUM KERNEL / FIDELITY OVERLAP CIRCUIT
    # ─────────────────────────────────────────────────────────────────────────
    print("\n5. Generating QSVM Kernel Fidelity Circuit Diagram...")
    fig, ax = qml.draw_mpl(qsvm_kernel_circuit, style="pennylane", decimals=2, level="device")(features_sim, features_base)
    save_diagram(
        fig,
        "qsvm_kernel_circuit",
        "QSVM Quantum Kernel Circuit — State Overlap Fidelity |<phi(x2)|phi(x1)>|^2",
        "State Prep U(x1) + Adjoint Unitary U†(x2) + All-Zero Ground State Probability P(|0000>)"
    )

    txt_qsvm_kernel = qml.draw(qsvm_kernel_circuit, decimals=2)(features_sim, features_base)
    txt_qsvm_kernel_dev = qml.draw(qsvm_kernel_circuit, level="device", decimals=2)(features_sim, features_base)
    qsvm_kernel_txt_path = OUT_DIR / "qsvm_kernel_circuit.txt"
    with open(qsvm_kernel_txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("QSVM QUANTUM KERNEL CIRCUIT (TRANSITION FIDELITY OVERLAP)\n")
        f.write("Source: backend/ml_service.py (_quantum_kernel_circuit)\n")
        f.write("Computes: k(x1, x2) = |<0000| U†(x2) U(x1) |0000>|^2 = |<phi(x2)|phi(x1)>|^2\n")
        f.write("Measurement: Computational basis state probability P(|0000>) (index 0 of probs)\n")
        f.write("=" * 80 + "\n\n")
        f.write("--- High-Level Circuit Drawing ---\n")
        f.write(txt_qsvm_kernel + "\n\n")
        f.write("--- Decomposed Gate-Level Execution (Elementary Gates) ---\n")
        f.write(txt_qsvm_kernel_dev + "\n")
    print(f"  [+] Saved {qsvm_kernel_txt_path.name}")

    # ─────────────────────────────────────────────────────────────────────────
    # 6. SYMBOLIC FORMULATION DOCUMENTATION
    # ─────────────────────────────────────────────────────────────────────────
    print("\n6. Generating Symbolic Quantum Circuit Reference Document...")
    sym_path = OUT_DIR / "quantum_circuit_symbolic_reference.txt"
    with open(sym_path, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("SYMBOLIC QUANTUM CIRCUIT SPECIFICATIONS & EQUATIONS\n")
        f.write("Project: AI-Powered Digital Twin for State Climate Using Quantum Machine Learning\n")
        f.write("=" * 80 + "\n\n")
        f.write("1. FEATURE ENCODING TRANSFORMATION\n")
        f.write("   Let raw climate telemetry be X = [T, RH, W, R] where:\n")
        f.write("     T  = 2m Air Temperature (°C)\n")
        f.write("     RH = Relative Humidity (%)\n")
        f.write("     W  = 10m Wind Speed (km/h)\n")
        f.write("     R  = 24h Precipitation Total (mm)\n\n")
        f.write("   Using MinMaxScaler with feature range [0, pi]:\n")
        f.write("     x_i = pi * (X_i - min(X_i)) / (max(X_i) - min(X_i)),  for i in {0, 1, 2, 3}\n\n")
        
        f.write("2. VQC SYMBOLIC UNITARY EVOLUTION\n")
        f.write("   The circuit operator is:\n")
        f.write("     U_VQC(theta, x) = U_ansatz(theta) * U_feat(x)\n\n")
        f.write("   Feature Map (Pauli-Z Angle Embedding):\n")
        f.write("     U_feat(x) = RZ_0(x_0) (x) RZ_1(x_1) (x) RZ_2(x_2) (x) RZ_3(x_3)\n\n")
        f.write("   Variational Ansatz (2 Layers with Ring Entanglement):\n")
        f.write("     U_ansatz(theta) = W_layer1 * W_layer0\n")
        f.write("     W_layer(l) = Entangler * Rotations(l)\n")
        f.write("     Rotations(l) = (x)_{i=0}^3 [ RZ_i(phi_{l, i}) * RY_i(theta_{l, i}) ]\n")
        f.write("     Entangler = CNOT(3, 0) * CNOT(2, 3) * CNOT(1, 2) * CNOT(0, 1)\n\n")
        f.write("   Measurement & Classification:\n")
        f.write("     <Z_i> = <0000| U_VQC^dagger * Z_i * U_VQC |0000>, for i in {0, 1, 2, 3}\n")
        f.write("     Predicted Risk Class = argmax(<Z_0>, <Z_1>, <Z_2>, <Z_3>) mod 4\n")
        f.write("     Output Classes: 0: 'Low', 1: 'Moderate', 2: 'High', 3: 'Severe'\n\n")

        f.write("3. QSVM QUANTUM KERNEL FORMULATION\n")
        f.write("   Quantum Feature Map Unitary:\n")
        f.write("     U(x) = CNOT(2, 3) * CNOT(1, 2) * CNOT(0, 1) * [ (x)_{i=0}^3 RY_i(x_i) ]\n")
        f.write("     |phi(x)> = U(x)|0000>\n\n")
        f.write("   Kernel Overlap (Fidelity):\n")
        f.write("     k(x1, x2) = |<phi(x2) | phi(x1)>|^2 = |<0000| U^dagger(x2) U(x1) |0000>|^2\n")
        f.write("   Evaluation:\n")
        f.write("     The circuit evaluates U^dagger(x2) U(x1)|0000> and computes computational basis\n")
        f.write("     state probabilities. P(|0000>) is the exact fidelity kernel similarity.\n")
        f.write("   Classical Support Vector Classifier:\n")
        f.write("     f(x) = sign( sum_{k} alpha_k * y_k * k(x_k, x) + b )\n")
        f.write("=" * 80 + "\n")
    print(f"  [+] Saved {sym_path.name}")

    print("\n" + "=" * 70)
    print("ALL QUANTUM DIAGRAMS AND DOCUMENTATION GENERATED SUCCESSFULLY!")
    print(f"Files saved in: {OUT_DIR}")
    print("=" * 70)


if __name__ == "__main__":
    generate_all_diagrams()

