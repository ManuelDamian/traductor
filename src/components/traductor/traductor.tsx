import React, { useState } from 'react';
import { transferirTraduccion } from "../../services/translateService";
import './traductor.scss';

export default function Traductor() {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');
  const [idioma, setIdioma] = useState('inglés');
  const [cargando, setCargando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const ejecutarTraduccion = async () => {
    if (!texto.trim()) return;
    setCargando(true);
    setResultado('');

    try {
      const data = await transferirTraduccion(texto, idioma);
      setResultado(data.traduccion);
    } catch (error) {
      setResultado('Hubo un error al procesar tu solicitud.');
    } finally {
      setCargando(false);
    }
  };

  const limpiarTexto = () => {
    setTexto('');
    setResultado('');
  };

  const copiarResultado = async () => {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resultado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles: ', err);
    }
  };

  return (
    <div className="translator-card">
      <h2 className="translator-title">Traductor (Gemini + Vite)</h2>

      <div className="input-group">
        <div className="group-header">
          <span>Texto original</span>
          {texto && (
            <button className="header-action-btn" onClick={limpiarTexto} title="Limpiar texto">
              ✕ Limpiar
            </button>
          )}
        </div>
        <textarea
          className="translator-textarea"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe o pega el texto aquí..."
        />
        <div className="group-footer">
          <span>{texto.length} caracteres</span>
        </div>
      </div>

      <div className="select-wrapper">
        <label htmlFor="idioma-select" className="select-label">Traducir al</label>
        <div className="language-select-container">
          <select
            id="idioma-select"
            className="language-select"
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
          >
            <option value="inglés">Inglés</option>
            <option value="francés">Francés</option>
            <option value="portugués">Portugués</option>
            <option value="italiano">Italiano</option>
            <option value="alemán">Alemán</option>
          </select>
          <div className="select-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Botón de traducir */}
      <button
        className="translate-btn"
        onClick={ejecutarTraduccion}
        disabled={cargando || !texto.trim()}
      >
        {cargando ? (
          <>
            <span className="spinner"></span>
            <span>Traduciendo...</span>
          </>
        ) : (
          <>
            <span>Traducir</span>
          </>
        )}
      </button>

      {/* Resultado de traducción */}
      <div className="input-group result-group">
        <div className="group-header">
          <span>Traducción ({idioma})</span>
          {resultado && (
            <button className="header-action-btn" onClick={copiarResultado}>
              {copiado ? '✓ Copiado' : '📋 Copiar'}
            </button>
          )}
        </div>
        <textarea
          className="translator-textarea"
          value={resultado}
          readOnly
          placeholder="La traducción aparecerá aquí..."
        />
      </div>
    </div>
  );
}