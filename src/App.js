import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [nbRecherches, setNbRecherches] = useState(0);

    function chargerLignes(){
      setChargement(true);
      setErreur(null);

      fetch("http://localhost:5000/lignes")
        .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
          setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
    }
    
  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
     if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
    setLigneSelectionnee(null);
    return;
  }

  fetch(`http://localhost:5000/lignes/${ligne.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur serveur : " + response.status);
      }
      return response.json();
    })
    .then(data => {
      setLigneSelectionnee(data);
    })
    .catch(error => {
      console.error("Erreur chargement détail :", error.message);
    });
}

// Ecran d'erreur
if (erreur) {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <div className="message-erreur">
          <p>Impossible de charger les lignes.</p>
          <p className="erreur-detail">{erreur}</p>
          <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
        </div>
      </main>
    </div>
  );
}

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={(valeur) => {setRecherche(valeur); setNbRecherches(nbRecherches + 1);} } />
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.length === 0 && (
          <p>
            Aucune ligne trouvée
            </p>
          )}
        <p className="compteur-recherche">
          Vous avez effectué {nbRecherches} recherche{nbRecherches > 1 ? 's' : ''}
        </p>
        <button onClick={() => setRecherche("")}>Effacer</button>
        <button onClick={chargerLignes}>Recharger</button>

        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;