import './StatReseau.css';

function StatReseau({ lignes }) {
    const totalLignes = lignes.length;
    const totalArrets = lignes.reduce((total, ligne) => total + ligne.arrets, 0);
    const ligneArretsMax = lignes.reduce((max, ligne) => ligne.arrets >max.arrets ? ligne : max);

    return(
        <div>
            <p>{totalLignes} lignes</p>
            <p>{totalArrets} arrets</p>
            <p>Ligne {ligneArretsMax.numero} : Plus d'arrets </p>
        </div>
    );
}

export default StatReseau;