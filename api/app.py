import json
from flask import Flask, jsonify
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    with open("lignes_ddd.json", "r") as f: 
        lignes = json.load(f)
    return jsonify(lignes)

@app.route("/arrets")
def get_arrets():
    arrets = set()
    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            if arret not in arrets:
                arrets.add(arret)

    return jsonify(list(arrets))

@app.route("/stats")
def get_stats():
    total_lignes = len(lignes)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    max_ligne_arrets = max(lignes, key = lambda l: l["arrets"])

    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_avec_plus_arrets": max_ligne_arrets["numero"]
    })

@app.route("/lignes/recherche")
def get_lignes_recherche():
    q = request.args.get("q", "")
    resultat = [
        ligne for ligne in lignes
        if q.lower() in ligne["depart"].lower() or q.lower() in ligne["arrivee"].lower()
    ]

    return jsonify(resultat)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

if __name__ == "__main__":
    app.run(debug=True, port=5000)