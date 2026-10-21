
import { useState } from "react";
import type { FormEvent } from "react";
import { useGoalsStore } from "../../goals/goals.store";
import { useFinancialGoalsStore } from "../financial-goals.store";

export function FinancialGoalForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const goals = useGoalsStore((s) => s.goals);
  const addGoal = useFinancialGoalsStore((s) => s.addGoal);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [goalId, setGoalId] = useState("");
  const [color, setColor] = useState("#873cff");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = addGoal({
      title: title.trim(),
      description: description.trim(),
      targetAmount: Number(targetAmount),
      initialAmount: Number(initialAmount),
      targetDate: targetDate || null,
      goalId: goalId || null,
      color,
    });

    if (!id) return;

    setTitle("");
    setDescription("");
    setTargetAmount("");
    setInitialAmount("0");
    setTargetDate("");
    setGoalId("");
    onCreated?.();
  }

  return (
    <form className="sf-financial-goal-form sf-card" onSubmit={submit}>
      <h3>Nueva meta de ahorro</h3>

      <label>
        ¿Para qué estás ahorrando?
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Comprar una computadora"
          required
        />
      </label>

      <label>
        Descripción
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="sf-financial-form-grid">
        <label>
          Cantidad objetivo
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
          />
        </label>

        <label>
          Ahorro inicial
          <input
            type="number"
            min="0"
            step="0.01"
            value={initialAmount}
            onChange={(e) => setInitialAmount(e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        Fecha objetivo (opcional)
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </label>

      <label>
        Vincular con objetivo de Silvana
        <select
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
        >
          <option value="">Sin vincular</option>
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </label>

      <label>
        Color
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <button className="sf-finance-primary" type="submit">
        Crear meta financiera
      </button>
    </form>
  );
}
