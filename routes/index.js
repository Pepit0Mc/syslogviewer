var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

/**
 * Affiche a l'utilisateur la page
 */
router.get('/', function (req, res, next) {
    res.render('index', {serveurs: JSON.stringify(serveurs)});
});

/**
 * Renvoie un json contenant toutes les informations a propos du serveur demande
 */
router.get('/testserveur', function (req, res, next) {

    var retour = {};
    var path = "http://" + serveurs[req.query["index"]]["ip"] + serveurs[req.query["index"]]["monitor"];
    fetch(path).then((res) => res.text()
    ).then((data) => {
        var tabdatas = JSON.parse(data);
        retour["infogenerale"] = tabdatas["General"];
        var i = 0;
        retour["disques"] = {};
        for (e in tabdatas["Partitions"]) {
            retour["disques"][i] = tabdatas["Partitions"][e];
            i++;
        }
        i = 0;
        retour["serveurs"] = {};
        for (e in tabdatas["Processes"]) {
            retour["serveurs"][i] = tabdatas["Processes"][e];
            i++
        }
        retour["test"] = testconfig(tabdatas);
        retour["reponse"] = true;
        res.json(retour);
    }).catch((err) => {
        retour["reponse"] = false;
        retour["warning"] = "Le " + serveurs[req.query["index"]]["nom"] + " ne réponds pas<br /><br />";
        retour["test"] = "./images/wifi_signal_gris.svg";
        res.json(retour);
    });
});

/**
 * Liste des serveurs
 * @type {Array}
 */
var serveurs = [];

serveurs[0] = {};
serveurs[0]["nom"] = "serveur test";
serveurs[0]["ip"] = "localhost:8000";
serveurs[0]["monitor"] = "/data.json";

serveurs[1] = {};
serveurs[1]["nom"] = "serveur dev 48";
serveurs[1]["ip"] = "192.168.1.48:3000";
serveurs[1]["monitor"] = "/sysinfo/data.json";

serveurs[2] = {};
serveurs[2]["nom"] = "serveur dev 92";
serveurs[2]["ip"] = "192.168.1.92:3000";
serveurs[2]["monitor"] = "/sysinfo/data.json";

serveurs[3] = {};
serveurs[3]["nom"] = "serveur dev 93";
serveurs[3]["ip"] = "192.168.1.93:3000";
serveurs[3]["monitor"] = "/sysinfo/data.json";

serveurs[4] = {};
serveurs[4]["nom"] = "serveur dev 207";
serveurs[4]["ip"] = "192.168.1.207:3000";
serveurs[4]["monitor"] = "/sysinfo/data.json";


/*
serveurs[0] = {};
serveurs[0]["nom"] = "serveur AUAweb";
serveurs[0]["ip"] = "149.202.165.4";
serveurs[0]["monitor"] = "/nodesysinfo/data.json";

serveurs[1] = {};
serveurs[1]["nom"] = "serveur sauvegarde";
serveurs[1]["ip"] = "149.202.206.92";
serveurs[1]["monitor"] = "/nodesysinfo/data.json";

serveurs[2] = {};
serveurs[2]["nom"] = "serveur UGO MX";
serveurs[2]["ip"] = "46.105.75.111";
serveurs[2]["monitor"] = "/nodesysinfo/data.json";

serveurs[3] = {};
serveurs[3]["nom"] = "serveur UGO";
serveurs[3]["ip"] = "51.255.141.19";
serveurs[3]["monitor"] = "/nodesysinfo/data.json";

serveurs[4] = {};
serveurs[4]["nom"] = "serveur PGMaster";
serveurs[4]["ip"] = "149.202.186.250";
serveurs[4]["monitor"] = "/nodesysinfo/data.json";

serveurs[5] = {};
serveurs[5]["nom"] = "serveur CKan";
serveurs[5]["ip"] = "149.202.179.38";
serveurs[5]["monitor"] = "/nodesysinfo/data.json";

serveurs[6] = {};
serveurs[6]["nom"] = "serveur Lizmap";
serveurs[6]["ip"] = "149.202.179.54";
serveurs[6]["monitor"] = "/nodesysinfo/data.json";

serveurs[7] = {};
serveurs[7]["nom"] = "serveur sauvegarde2 (NAS)";
serveurs[7]["ip"] = "51.255.92.100";
serveurs[7]["monitor"] = "/nodesysinfo/data.json";
/*
/*
serveurs[5]["nom"] ="serveur PGSlave";
serveurs[5]["ip"] = "149.202.179.176";
serveurs[5]["monitor"] = "/data.json";

serveurs[6]["nom"] ="serveur GeoNode";
serveurs[6]["ip"] = "149.202.179.46";
serveurs[6]["monitor"] = "phpsysinfo/xml.php?plugin=complete&json";

serveurs[XX]["nom"] ="serveur Pentaho";
serveurs[XX]["ip"] = "149.202.184.114";
serveurs[XX]["monitor"] = "phpsysinfo/xml.php?plugin=complete&json";*/

/**
 * Renvoie l'image du status du serveur a utiliser
 * @param diag Objet contenant toutes les informations a propos du serveur
 * @returns {string}
 */
function testconfig(diag) {
    var val_retour = "./images/wifi_signal_gris.svg";
    var retour = [];
    for (var e in diag["Partitions"]) {
        if (diag["Partitions"][e]["Use%"].slice(0, -1) > "85") {
            retour.push("warning");
        } else if (diag["Partitions"][e]["Use%"].slice(0, -1) > "70") {
            retour.push("error");
        } else {
            retour.push("cool");
        }
    }
    for (e in diag["Services"]) {
        if (diag["Services"][e]["running"] === false) {
            retour.push("warning");
        } else {
            retour.push("cool");
        }
    }
    for (e in retour) {
        if (retour[e] === "warning")
            val_retour = "./images/wifi_signal_orange.svg";
    }
    for (e in retour) {
        if (retour[e] === "error")
            val_retour = "./images/wifi_signal_rouge.svg";
    }
    if (val_retour === "./images/wifi_signal_gris.svg") {
        val_retour = "./images/wifi_signal_vert.svg";
    }
    return val_retour;
}

module.exports = router;
