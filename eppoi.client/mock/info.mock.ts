import { defineMock } from 'vite-plugin-mock-dev-server';

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true';

export default defineMock([{
    url: '/api/Info/GetMunicipalityInfo',
    method: 'GET',
    status: 200,
    enabled: useMock,
    body: {
      success: true,
      result: {
        "poi": [
          {
            "entityId": "2e3582c9-238d-495d-8440-9b4abaf35e2f",
            "entityName": "Borgo di Marano ",
            "imagePath": "/Media/POI/primary-thumb-2e3582c9-238d-495d-8440-9b4abaf35e2f.webp",
            "badgeText": "Castello",
            "address": ""
          },
          {
            "entityId": "247f349a-874c-42f2-9825-7061b2618c1f",
            "entityName": "Casa Museo Nazzareno Tomassetti",
            "imagePath": "/Media/POI/primary-thumb-247f349a-874c-42f2-9825-7061b2618c1f.webp",
            "badgeText": "Museo",
            "address": "19, Via Sabotino, Marano"
          },
          {
            "entityId": "5b07dcd9-100a-440b-a90c-dbad8c6aa5db",
            "entityName": "Castello di Sant'Andrea",
            "imagePath": "/Media/POI/primary-thumb-5b07dcd9-100a-440b-a90c-dbad8c6aa5db.webp",
            "badgeText": "Castello",
            "address": "Via San Gregorio Magno, Marano"
          },
          {
            "entityId": "c6f8fe83-1c32-4f9b-9d54-99a0f06dd945",
            "entityName": "Chiesa dell'Annunziata",
            "imagePath": "/Media/POI/primary-thumb-c6f8fe83-1c32-4f9b-9d54-99a0f06dd945.webp",
            "badgeText": "Chiesa",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "ac75653b-831f-4dc1-922a-37bdcfc686bf",
            "entityName": "Chiesa di San Basso e Santa Margherita",
            "imagePath": "/Media/POI/primary-thumb-ac75653b-831f-4dc1-922a-37bdcfc686bf.webp",
            "badgeText": "Chiesa",
            "address": "Via Giuseppe Viviani, Marano"
          },
          {
            "entityId": "710fce5f-3cea-434b-9775-50ad054e7631",
            "entityName": "Chiesa di Santa Maria in Castello ",
            "imagePath": "/Media/POI/primary-thumb-710fce5f-3cea-434b-9775-50ad054e7631.webp",
            "badgeText": "Chiesa",
            "address": "Contrada San Silvestro, Marano"
          },
          {
            "entityId": "071c2007-30af-4c1b-800a-66a625877efe",
            "entityName": "Cinema Margherita",
            "imagePath": "/Media/POI/primary-thumb-071c2007-30af-4c1b-800a-66a625877efe.webp",
            "badgeText": "Cinema",
            "address": "23, Via Cavour, Marano"
          },
          {
            "entityId": "b3cc09f1-d945-4851-a864-b52312077805",
            "entityName": "Mura medievali del Borgo di Marano",
            "imagePath": "/Media/POI/primary-thumb-b3cc09f1-d945-4851-a864-b52312077805.webp",
            "badgeText": "Mura",
            "address": ""
          },
          {
            "entityId": "e84be8ae-c800-427d-a565-484d72660936",
            "entityName": "Museo Archeologico del Territorio",
            "imagePath": "/Media/POI/primary-thumb-e84be8ae-c800-427d-a565-484d72660936.webp",
            "badgeText": "Museo",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "24c1e908-8e94-4c39-915d-20c9385b30ea",
            "entityName": "Museo Archeologico di Ripatransone",
            "imagePath": "/Media/POI/primary-thumb-24c1e908-8e94-4c39-915d-20c9385b30ea.webp",
            "badgeText": "Museo",
            "address": "1, Piazza Venti Settembre"
          },
          {
            "entityId": "4eae81ad-707f-4ab9-ad74-84b74169e30e",
            "entityName": "Museo Malacologico Piceno",
            "imagePath": "/Media/POI/primary-thumb-4eae81ad-707f-4ab9-ad74-84b74169e30e.webp",
            "badgeText": "Museo",
            "address": "240, Via Adriatica Nord"
          },
          {
            "entityId": "470bcb69-8d8b-49cf-9bd4-5de11b13b40c",
            "entityName": "Ninfeo e Villa Romana",
            "imagePath": "/Media/POI/primary-thumb-470bcb69-8d8b-49cf-9bd4-5de11b13b40c.webp",
            "badgeText": "Villa",
            "address": "Via Giovanni Ventitreesimo, Marano"
          },
          {
            "entityId": "b0961ab7-4f33-4640-b270-2371ce6f084f",
            "entityName": "Palazzo Brancadoro Sforza",
            "imagePath": "/Media/POI/primary-thumb-b0961ab7-4f33-4640-b270-2371ce6f084f.webp",
            "badgeText": "Palazzo",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "91b8a53f-c244-4cdc-88db-6a4ad27a0704",
            "entityName": "Parco Archeologico Naturalistico \"Civita\"",
            "imagePath": "/Media/POI/primary-thumb-91b8a53f-c244-4cdc-88db-6a4ad27a0704.webp",
            "badgeText": "Parco archeologico",
            "address": ""
          },
          {
            "entityId": "7e68c0e5-07b4-47fa-b717-03b1d16ccf41",
            "entityName": "Piazza Libertà",
            "imagePath": "/Media/POI/primary-thumb-7e68c0e5-07b4-47fa-b717-03b1d16ccf41.webp",
            "badgeText": "Piazza",
            "address": ""
          },
          {
            "entityId": "0e21ec87-6fa4-44bc-aad0-60d4d0ef2156",
            "entityName": "Pieve di San Basso alla Civita",
            "imagePath": "/Media/POI/primary-thumb-0e21ec87-6fa4-44bc-aad0-60d4d0ef2156.webp",
            "badgeText": "Chiesa",
            "address": "Via delle Ginestre, Marano"
          },
          {
            "entityId": "b542da9b-3a8b-45ac-9dce-5f70a5c93c0f",
            "entityName": "Pitture di Pauri",
            "imagePath": "/Media/POI/primary-thumb-b542da9b-3a8b-45ac-9dce-5f70a5c93c0f.webp",
            "badgeText": "Galleria",
            "address": "Via Giuseppe Viviani, Marano"
          },
          {
            "entityId": "cda7f230-26f2-4eed-a311-eacb900b6a3e",
            "entityName": "Porta Marina",
            "imagePath": "/Media/POI/primary-thumb-cda7f230-26f2-4eed-a311-eacb900b6a3e.webp",
            "badgeText": "Mura",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "d43754ad-eb19-47e6-be29-213e9c819dc8",
            "entityName": "Porte d'ingresso Marano",
            "imagePath": "/Media/POI/primary-thumb-d43754ad-eb19-47e6-be29-213e9c819dc8.webp",
            "badgeText": "Mura",
            "address": ""
          },
          {
            "entityId": "08a77adb-4b9f-4f73-a312-38a373005e14",
            "entityName": "Sezione Paleolitica - Museo Archeologico del Territorio",
            "imagePath": "/Media/POI/primary-thumb-08a77adb-4b9f-4f73-a312-38a373005e14.webp",
            "badgeText": "Museo",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "36fd1f95-b92a-43e3-b74b-945f7fad269d",
            "entityName": "Sezione Picena - Museo Archeologico del Territorio",
            "imagePath": "/Media/POI/primary-thumb-36fd1f95-b92a-43e3-b74b-945f7fad269d.webp",
            "badgeText": "Museo",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "d91ef0cc-d232-4d64-a1a9-9edc6668363d",
            "entityName": "Sezione Romana - Museo Archeologico del Territorio",
            "imagePath": "/Media/POI/primary-thumb-d91ef0cc-d232-4d64-a1a9-9edc6668363d.webp",
            "badgeText": "Museo",
            "address": "Via Castello, Marano"
          },
          {
            "entityId": "85184c79-8db0-4a22-a0a4-9a4ec5a68d2d",
            "entityName": "Tavola di Vittore Crivelli",
            "imagePath": "/Media/POI/primary-thumb-85184c79-8db0-4a22-a0a4-9a4ec5a68d2d.webp",
            "badgeText": "Galleria",
            "address": "Via Giuseppe Viviani, Marano"
          },
          {
            "entityId": "1df710a1-3ff8-4e29-99d9-2add3b53fa64",
            "entityName": "Villa Grisostomi",
            "imagePath": "/Media/POI/primary-thumb-1df710a1-3ff8-4e29-99d9-2add3b53fa64.webp",
            "badgeText": "Villa",
            "address": "Contrada San Silvestro, Marano"
          }
        ],
        "events": [
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "26/04/2025",
            "entityId": "ecc8adb8-3c58-46f5-a381-3eb3e12438d3",
            "entityName": "Triathlon",
            "imagePath": "/Media/PublicEvent/primary-thumb-ecc8adb8-3c58-46f5-a381-3eb3e12438d3.webp",
            "badgeText": "Gara / Torneo / Competizione",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "12/06/2025 - 11/09/2025",
            "entityId": "c2f3f32d-c0d6-449c-81fa-700942b958cf",
            "entityName": "Mercatini sul lungomare",
            "imagePath": "/Media/PublicEvent/primary-thumb-c2f3f32d-c0d6-449c-81fa-700942b958cf.webp",
            "badgeText": "Mercato / Mercatino",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "20/06/2025 - 18/07/2025",
            "entityId": "0248b673-df3a-43ce-a204-096f69589313",
            "entityName": "Teatro al Parco Festival",
            "imagePath": "/images/default-placeholder.webp",
            "badgeText": "Spettacolo teatrale",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "22/06/2025 - 07/09/2025",
            "entityId": "0ada9b5f-0ce6-4837-ae66-c4a39ca4838b",
            "entityName": "Estate in festa",
            "imagePath": "/Media/PublicEvent/primary-thumb-0ada9b5f-0ce6-4837-ae66-c4a39ca4838b.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "23/06/2025 - 14/07/2025",
            "entityId": "21a38e1a-f8bc-4f0e-99f9-44664118d2ad",
            "entityName": "Cinema all'aperto",
            "imagePath": "/Media/PublicEvent/primary-thumb-21a38e1a-f8bc-4f0e-99f9-44664118d2ad.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "28/06/2025",
            "entityId": "2eb384c3-cbe5-40cb-8fa2-b53282f7c126",
            "entityName": "Maratonina di Cupra Marittima",
            "imagePath": "/Media/PublicEvent/primary-thumb-2eb384c3-cbe5-40cb-8fa2-b53282f7c126.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "02/07/2025 - 31/08/2025",
            "entityId": "db0b06f6-c7b3-4edd-bf54-a5792ae21fa2",
            "entityName": "Cupra Musica Festival",
            "imagePath": "/Media/PublicEvent/primary-thumb-db0b06f6-c7b3-4edd-bf54-a5792ae21fa2.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "17/07/2025 - 19/07/2025",
            "entityId": "6ff94497-57c6-4428-a004-c22ff7f08461",
            "entityName": "Serate Danzanti in Piazza Possenti",
            "imagePath": "/images/default-placeholder.webp",
            "badgeText": "Spettacolo di danza",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "25/07/2025 - 27/07/2025",
            "entityId": "936dc3c4-49ec-4379-9e04-cda44d2eed8f",
            "entityName": "Quartieri senza frontiere",
            "imagePath": "/Media/PublicEvent/primary-thumb-936dc3c4-49ec-4379-9e04-cda44d2eed8f.webp",
            "badgeText": "Gara / Torneo / Competizione",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "17/08/2025",
            "entityId": "2c53dab4-5e2a-4136-9639-c93960616316",
            "entityName": "Carnevale estivo",
            "imagePath": "/Media/PublicEvent/primary-thumb-2c53dab4-5e2a-4136-9639-c93960616316.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "22/08/2025 - 24/08/2025",
            "entityId": "5d246a7d-78f0-4156-a351-954f6cd3cdec",
            "entityName": "Festa di San Basso",
            "imagePath": "/Media/PublicEvent/primary-thumb-5d246a7d-78f0-4156-a351-954f6cd3cdec.webp",
            "badgeText": "Festa patronale / Festa dei santi",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "22/08/2025 - 24/08/2025",
            "entityId": "002f4352-9f41-4bad-9e38-bcc5666e9f34",
            "entityName": "Sagra degli Gnocchi ai Frutti di Mare",
            "imagePath": "/Media/PublicEvent/primary-thumb-002f4352-9f41-4bad-9e38-bcc5666e9f34.webp",
            "badgeText": "Sagra",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "30/08/2025",
            "entityId": "d199b4bb-933f-4e0d-9dfa-34fcf7c70e33",
            "entityName": "Cupra Beach Party",
            "imagePath": "/Media/PublicEvent/primary-thumb-d199b4bb-933f-4e0d-9dfa-34fcf7c70e33.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "06/09/2025",
            "entityId": "32f5133e-23fa-40fa-b9f6-72d7604ba128",
            "entityName": "Notte dello Sport",
            "imagePath": "/Media/PublicEvent/primary-thumb-32f5133e-23fa-40fa-b9f6-72d7604ba128.webp",
            "badgeText": "Gara / Torneo / Competizione",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "19/09/2025 - 21/09/2025",
            "entityId": "56dc153e-acd6-4a1d-90c5-7dd49c8b012f",
            "entityName": "Festa di San Gabriele e Madonna Addolorata",
            "imagePath": "/Media/PublicEvent/primary-thumb-56dc153e-acd6-4a1d-90c5-7dd49c8b012f.webp",
            "badgeText": "Festa patronale / Festa dei santi",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "19/09/2025 - 21/09/2025",
            "entityId": "148c7838-61da-4446-9347-9cf1f0ccb2bc",
            "entityName": "Sagra della Polenta con le Concole",
            "imagePath": "/Media/PublicEvent/primary-thumb-148c7838-61da-4446-9347-9cf1f0ccb2bc.webp",
            "badgeText": "Sagra",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "12/10/2025",
            "entityId": "b8c65a26-db6b-43a0-b798-8c763c92ed4c",
            "entityName": "Festival Cupra per l'Ambiente",
            "imagePath": "/Media/PublicEvent/primary-thumb-b8c65a26-db6b-43a0-b798-8c763c92ed4c.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "29/10/2025 - 09/11/2025",
            "entityId": "061a775a-df4f-4492-9bbe-014d64463d17",
            "entityName": "Marchestorie",
            "imagePath": "/Media/PublicEvent/primary-thumb-061a775a-df4f-4492-9bbe-014d64463d17.webp",
            "badgeText": "Festival",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "08/11/2025 - 09/11/2025",
            "entityId": "84e6672c-9fd8-4ce7-bc2d-d95214b38ad9",
            "entityName": "Castagne al Borgo",
            "imagePath": "/Media/PublicEvent/primary-thumb-84e6672c-9fd8-4ce7-bc2d-d95214b38ad9.webp",
            "badgeText": "Sagra",
            "address": null
          },
          {
            "municipalityData": {
              "name": "Cupra Marittima",
              "logoPath": "/Media/Organization/logo-00356330449.png"
            },
            "date": "31/05/2026",
            "entityId": "a24b56e4-1e3e-4332-bc6b-d0a4ba701c92",
            "entityName": "Fiera di Maggio",
            "imagePath": "/Media/PublicEvent/primary-thumb-a24b56e4-1e3e-4332-bc6b-d0a4ba701c92.webp",
            "badgeText": "Fiera / Salone",
            "address": null
          }
        ],
        "articles": [
          {
            "entityId": "277a3d04-e7ea-476a-8745-213a894be71a",
            "entityName": "Cupra Marittima, un gioiello della Riviera delle Palme",
            "imagePath": "/Media/Article/primary-thumb-277a3d04-e7ea-476a-8745-213a894be71a.webp",
            "badgeText": "6 minuti ",
            "address": null
          }
        ],
        "organizations": [
          {
            "entityId": "01782600447",
            "entityName": "Antichi Sapori Di Flammini Giuseppe & Pennesi S.N.C.",
            "imagePath": "/Media/Organization/primary-thumb-01782600447.webp",
            "badgeText": "Società in nome collettivo",
            "address": "1, Via Roma, Marano"
          },
          {
            "entityId": "02064290444",
            "entityName": "Baia Marina Sas Di Diana Giovanna Di Federico & C.",
            "imagePath": "/Media/Organization/primary-thumb-02064290444.webp",
            "badgeText": "Società in accomandita semplice",
            "address": "52, Via Nazario Sauro, Marano"
          },
          {
            "entityId": "00287410443",
            "entityName": "Camping Led Zeppelin S.R.L.",
            "imagePath": "/Media/Organization/primary-thumb-00287410443.webp",
            "badgeText": "Società a responsabilità limitata",
            "address": "5, Contrada Boccabianca"
          },
          {
            "entityId": "00484300447",
            "entityName": "Camping*Terrazzo Sul Mare Di De Carolis Odoardo & C. - S.N.C.",
            "imagePath": "/Media/Organization/primary-thumb-00484300447.webp",
            "badgeText": "Società in nome collettivo",
            "address": "105, Via Adriatica Nord"
          },
          {
            "entityId": "01816170441",
            "entityName": "Carlitos Bike Di Croci Carlo",
            "imagePath": "/Media/Organization/primary-thumb-01816170441.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "89, Corso Vittorio Emanuele II, Marano"
          },
          {
            "entityId": "02490630445",
            "entityName": "Dama Medica Societa' A Responsabilita' Limitata Semplificata",
            "imagePath": "/Media/Organization/primary-thumb-02490630445.webp",
            "badgeText": "Società a responsabilità limitata",
            "address": "1, Via Giuseppe Garibaldi, Marano"
          },
          {
            "entityId": "00760550442",
            "entityName": "Di Fiore Forni Di Di Fiore Alessandro & C. Snc",
            "imagePath": "/Media/Organization/primary-thumb-00760550442.webp",
            "badgeText": "Società in nome collettivo",
            "address": "19, Via San Giacomo della Marca"
          },
          {
            "entityId": "02194270449",
            "entityName": "Farano Stefano",
            "imagePath": "/Media/Organization/primary-thumb-02194270449.webp",
            "badgeText": "Imprenditore individuale agricolo",
            "address": "54, Strada Provinciale 91 Valmenocchia"
          },
          {
            "entityId": "02227470446",
            "entityName": "Fm Hotel Srl",
            "imagePath": "/Media/Organization/primary-thumb-02227470446.webp",
            "badgeText": "Società a responsabilità limitata",
            "address": "18, Via Nazario Sauro, Marano"
          },
          {
            "entityId": "01066200443",
            "entityName": "Forneria Tassotti Di Tassotti Emilio & C. S.N.C.",
            "imagePath": "/Media/Organization/primary-thumb-01066200443 .webp",
            "badgeText": "Società in nome collettivo",
            "address": "36, Corso Vittorio Emanuele II, Marano"
          },
          {
            "entityId": "01630640447",
            "entityName": "Hotel Ideal Di Sciamanna Gino & C. S.A.S.",
            "imagePath": "/Media/Organization/primary-thumb-01630640447.webp",
            "badgeText": "Società in accomandita semplice",
            "address": "Via Nazario Sauro, Marano"
          },
          {
            "entityId": "02124790441",
            "entityName": "Hotel Marano Di Beri Alberto",
            "imagePath": "/Media/Organization/primary-thumb-02124790441.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "118, Via Adriatica Nord"
          },
          {
            "entityId": "02028520449",
            "entityName": "Hotel Ristorante Europa S.R.L.",
            "imagePath": "/Media/Organization/primary-thumb-02028520449.webp",
            "badgeText": "Società a responsabilità limitata",
            "address": "29, Viale Giuseppe Romita"
          },
          {
            "entityId": "02483880445",
            "entityName": "Hotel Ristorante Primo Sole di Abbadini Fabrizio",
            "imagePath": "/Media/Organization/primary-thumb-02483880445.webp",
            "badgeText": "Imprenditore individuale agricolo",
            "address": "10, Contrada San Michele, Marano"
          },
          {
            "entityId": "CHPLDN68C61H321S",
            "entityName": "La Selva Festeggiante Home Restaurant di Chiappini Loredana",
            "imagePath": "/Media/Organization/primary-thumb-CHPLDN68C61H321S.webp",
            "badgeText": "Lavoratore autonomo",
            "address": ""
          },
          {
            "entityId": "02288410448",
            "entityName": "Macondo Di Catasta Lorenzo",
            "imagePath": "/Media/Organization/primary-thumb-02288410448.webp",
            "badgeText": "Imprenditore individuale agricolo",
            "address": "2, Via Colle Bruno"
          },
          {
            "entityId": "02428850446",
            "entityName": "Mani Di Fata Di Sabrina Pisano",
            "imagePath": "/Media/Organization/primary-thumb-02428850446.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "1, Via Minniti, Marano"
          },
          {
            "entityId": "01430750446",
            "entityName": "Mignini Emanuela",
            "imagePath": "/Media/Organization/primary-thumb-01430750446.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "5, Via Ernesto Ciucci"
          },
          {
            "entityId": "02550560441",
            "entityName": "Pasticceria Safe Di Mora Sara E Santilli Federica S.N.C.",
            "imagePath": "/Media/Organization/primary-thumb-02550560441.webp",
            "badgeText": "Società in nome collettivo",
            "address": "2, Corso Vittorio Emanuele II, Marano"
          },
          {
            "entityId": "01290320447",
            "entityName": "Pescheria*Mondo*Marino Di Zocchi Domenico",
            "imagePath": "/Media/Organization/primary-thumb-01290320447.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "13, Corso Vittorio Emanuele II, Marano"
          },
          {
            "entityId": "02231910445",
            "entityName": "Sapori di Cupra Azienda Agricola di Castelli Marino",
            "imagePath": "/Media/Organization/primary-thumb-02231910445.webp",
            "badgeText": "Imprenditore individuale agricolo",
            "address": ""
          },
          {
            "entityId": "01922700446",
            "entityName": "Societa' Agricola Orto Degli Ulivi Di Pietro Giuliani E C. Societa' Semplice",
            "imagePath": "/Media/Organization/primary-thumb-01922700446.webp",
            "badgeText": "Società semplice",
            "address": "54, Contrada San Michele, Marano"
          },
          {
            "entityId": "02515340442",
            "entityName": "Soluzioni In Cucina Di Polidori Massimo",
            "imagePath": "/Media/Organization/primary-thumb-02515340442.webp",
            "badgeText": "Imprenditore individuale non agricolo",
            "address": "27, Via Adriatica Nord, Marano"
          }
        ]
      }
    },
}, {
  url: '/api/LocalInfo/GetCategories',
  method: 'GET',
  status: 200,
  enabled: useMock,
  body: {
    success: true,
    result: {
      "result": [
        {
          "name": "ArtCulture",
          "label": "Arte e cultura"
        },
        {
          "name": "Articles",
          "label": "Articoli e magazine"
        },
        {
          "name": "Sleep",
          "label": "Dormire"
        },
        {
          "name": "Events",
          "label": "Eventi"
        },
        {
          "name": "Routes",
          "label": "Itinerari"
        },
        {
          "name": "EatAndDrink",
          "label": "Mangiare e bere"
        },
        {
          "name": "Nature",
          "label": "Natura"
        },
        {
          "name": "Organizations",
          "label": "Operatori economici"
        },
        {
          "name": "TypicalProducts",
          "label": "Prodotti tipici"
        },
        {
          "name": "Shopping",
          "label": "Punti vendita"
        },
        {
          "name": "Services",
          "label": "Servizi"
        },
        {
          "name": "EntertainmentLeisure",
          "label": "Svago e divertimento"
        }
      ],
      "id": 384,
      "exception": null,
      "status": 5,
      "isCanceled": false,
      "isCompleted": true,
      "isCompletedSuccessfully": true,
      "creationOptions": 0,
      "asyncState": null,
      "isFaulted": false
    }
  }
}, {
  url: '/api/LocalInfo/GetDiscoverList',
  method: 'GET',
  status: 200,
  enabled: useMock,
  body: {
    success: true,
    result: {
      "result": [
        {
          "date": null,
          "entityId": "071c2007-30af-4c1b-800a-66a625877efe",
          "entityName": "Cinema Margherita",
          "imagePath": "/Media/POI/primary-071c2007-30af-4c1b-800a-66a625877efe.webp",
          "badgeText": "Cinema",
          "address": "23, Via Cavour, Marano"
        },
        {
          "date": null,
          "entityId": "08a77adb-4b9f-4f73-a312-38a373005e14",
          "entityName": "Sezione Paleolitica - Museo Archeologico del Territorio",
          "imagePath": "/Media/POI/primary-08a77adb-4b9f-4f73-a312-38a373005e14.webp",
          "badgeText": "Museo",
          "address": "Via Castello, Marano"
        },
        {
          "date": null,
          "entityId": "0e21ec87-6fa4-44bc-aad0-60d4d0ef2156",
          "entityName": "Pieve di San Basso alla Civita",
          "imagePath": "/Media/POI/primary-0e21ec87-6fa4-44bc-aad0-60d4d0ef2156.webp",
          "badgeText": "Chiesa",
          "address": "Via delle Ginestre, Marano"
        },
        {
          "date": null,
          "entityId": "1df710a1-3ff8-4e29-99d9-2add3b53fa64",
          "entityName": "Villa Grisostomi",
          "imagePath": "/Media/POI/primary-1df710a1-3ff8-4e29-99d9-2add3b53fa64.webp",
          "badgeText": "Villa",
          "address": ""
        },
        {
          "date": null,
          "entityId": "247f349a-874c-42f2-9825-7061b2618c1f",
          "entityName": "Casa Museo Nazzareno Tomassetti",
          "imagePath": "/Media/POI/primary-247f349a-874c-42f2-9825-7061b2618c1f.webp",
          "badgeText": "Museo",
          "address": "19, Via Sabotino, Marano"
        },
        {
          "date": null,
          "entityId": "24c1e908-8e94-4c39-915d-20c9385b30ea",
          "entityName": "Museo Archeologico di Ripatransone",
          "imagePath": "/Media/POI/primary-24c1e908-8e94-4c39-915d-20c9385b30ea.webp",
          "badgeText": "Museo",
          "address": "1, Piazza Venti Settembre"
        },
        {
          "date": null,
          "entityId": "2e3582c9-238d-495d-8440-9b4abaf35e2f",
          "entityName": "Borgo di Marano",
          "imagePath": "/Media/POI/primary-2e3582c9-238d-495d-8440-9b4abaf35e2f.webp",
          "badgeText": "Castello",
          "address": ""
        },
        {
          "date": null,
          "entityId": "36fd1f95-b92a-43e3-b74b-945f7fad269d",
          "entityName": "Sezione Picena - Museo Archeologico del Territorio",
          "imagePath": "/Media/POI/primary-36fd1f95-b92a-43e3-b74b-945f7fad269d.webp",
          "badgeText": "Museo",
          "address": "Via Castello, Marano"
        },
        {
          "date": null,
          "entityId": "470bcb69-8d8b-49cf-9bd4-5de11b13b40c",
          "entityName": "Ninfeo e Villa Romana",
          "imagePath": "/Media/POI/primary-470bcb69-8d8b-49cf-9bd4-5de11b13b40c.webp",
          "badgeText": "Villa",
          "address": "Via Giovanni Ventitreesimo, Marano"
        },
        {
          "date": null,
          "entityId": "4c6eed8d-24f6-446b-9314-a187229f30b9",
          "entityName": "Belvedere Menocchia",
          "imagePath": "/Media/POI/primary-4c6eed8d-24f6-446b-9314-a187229f30b9.webp",
          "badgeText": "Belvedere",
          "address": ""
        },
        {
          "date": null,
          "entityId": "4eae81ad-707f-4ab9-ad74-84b74169e30e",
          "entityName": "Museo Malacologico Piceno",
          "imagePath": "/Media/POI/primary-4eae81ad-707f-4ab9-ad74-84b74169e30e.webp",
          "badgeText": "Museo",
          "address": "240, Via Adriatica Nord"
        },
        {
          "date": null,
          "entityId": "522ddd3b-97e9-4cfc-9930-b4fb37cc1b18",
          "entityName": "Contrada Santi",
          "imagePath": "/Media/POI/primary-522ddd3b-97e9-4cfc-9930-b4fb37cc1b18.webp",
          "badgeText": "Viale",
          "address": ""
        },
        {
          "date": null,
          "entityId": "5b07dcd9-100a-440b-a90c-dbad8c6aa5db",
          "entityName": "Castello di Sant'Andrea",
          "imagePath": "/Media/POI/primary-5b07dcd9-100a-440b-a90c-dbad8c6aa5db.webp",
          "badgeText": "Castello",
          "address": "Via San Gregorio Magno, Marano"
        },
        {
          "date": null,
          "entityId": "6a5596c3-2e83-4b43-b8f8-f43ed22f8ba1",
          "entityName": "Spiaggia di Cupra Marittima",
          "imagePath": "/Media/POI/primary-6a5596c3-2e83-4b43-b8f8-f43ed22f8ba1.webp",
          "badgeText": "Costa marittima",
          "address": ""
        },
        {
          "date": null,
          "entityId": "710fce5f-3cea-434b-9775-50ad054e7631",
          "entityName": "Chiesa di Santa Maria in Castello",
          "imagePath": "/Media/POI/primary-710fce5f-3cea-434b-9775-50ad054e7631.webp",
          "badgeText": "Chiesa",
          "address": ""
        },
        {
          "date": null,
          "entityId": "7e68c0e5-07b4-47fa-b717-03b1d16ccf41",
          "entityName": "Piazza Libertà",
          "imagePath": "/Media/POI/primary-7e68c0e5-07b4-47fa-b717-03b1d16ccf41.webp",
          "badgeText": "Piazza",
          "address": ""
        },
        {
          "date": null,
          "entityId": "85184c79-8db0-4a22-a0a4-9a4ec5a68d2d",
          "entityName": "Tavola di Vittore Crivelli",
          "imagePath": "/Media/POI/primary-85184c79-8db0-4a22-a0a4-9a4ec5a68d2d.webp",
          "badgeText": "Galleria",
          "address": "Via Giuseppe Viviani, Marano"
        },
        {
          "date": null,
          "entityId": "91b8a53f-c244-4cdc-88db-6a4ad27a0704",
          "entityName": "Parco Archeologico Naturalistico \"Civita\"",
          "imagePath": "/Media/POI/primary-91b8a53f-c244-4cdc-88db-6a4ad27a0704.webp",
          "badgeText": "Parco archeologico",
          "address": ""
        },
        {
          "date": null,
          "entityId": "ac75653b-831f-4dc1-922a-37bdcfc686bf",
          "entityName": "Chiesa di San Basso e Santa Margherita",
          "imagePath": "/Media/POI/primary-ac75653b-831f-4dc1-922a-37bdcfc686bf.webp",
          "badgeText": "Chiesa",
          "address": "Via Giuseppe Viviani, Marano"
        },
        {
          "date": null,
          "entityId": "b0961ab7-4f33-4640-b270-2371ce6f084f",
          "entityName": "Palazzo Brancadoro Sforza",
          "imagePath": "/Media/POI/primary-b0961ab7-4f33-4640-b270-2371ce6f084f.webp",
          "badgeText": "Palazzo",
          "address": ""
        },
        {
          "date": null,
          "entityId": "b3cc09f1-d945-4851-a864-b52312077805",
          "entityName": "Mura medievali del Borgo di Marano",
          "imagePath": "/Media/POI/primary-b3cc09f1-d945-4851-a864-b52312077805.webp",
          "badgeText": "Mura",
          "address": ""
        },
        {
          "date": null,
          "entityId": "b542da9b-3a8b-45ac-9dce-5f70a5c93c0f",
          "entityName": "Pitture di Pauri",
          "imagePath": "/Media/POI/primary-b542da9b-3a8b-45ac-9dce-5f70a5c93c0f.webp",
          "badgeText": "Galleria",
          "address": "Via Giuseppe Viviani, Marano"
        },
        {
          "date": null,
          "entityId": "c6f8fe83-1c32-4f9b-9d54-99a0f06dd945",
          "entityName": "Chiesa dell'Annunziata",
          "imagePath": "/Media/POI/primary-c6f8fe83-1c32-4f9b-9d54-99a0f06dd945.webp",
          "badgeText": "Chiesa",
          "address": ""
        },
        {
          "date": null,
          "entityId": "cda7f230-26f2-4eed-a311-eacb900b6a3e",
          "entityName": "Porta Marina",
          "imagePath": "/Media/POI/primary-cda7f230-26f2-4eed-a311-eacb900b6a3e.webp",
          "badgeText": "Mura",
          "address": ""
        },
        {
          "date": null,
          "entityId": "d43754ad-eb19-47e6-be29-213e9c819dc8",
          "entityName": "Porte d'ingresso Marano",
          "imagePath": "/Media/POI/primary-d43754ad-eb19-47e6-be29-213e9c819dc8.webp",
          "badgeText": "Mura",
          "address": ""
        },
        {
          "date": null,
          "entityId": "d91ef0cc-d232-4d64-a1a9-9edc6668363d",
          "entityName": "Sezione Romana - Museo Archeologico del Territorio",
          "imagePath": "/Media/POI/primary-d91ef0cc-d232-4d64-a1a9-9edc6668363d.webp",
          "badgeText": "Museo",
          "address": "Via Castello, Marano"
        },
        {
          "date": null,
          "entityId": "e84be8ae-c800-427d-a565-484d72660936",
          "entityName": "Museo Archeologico del Territorio",
          "imagePath": "/Media/POI/primary-e84be8ae-c800-427d-a565-484d72660936.webp",
          "badgeText": "Museo",
          "address": ""
        },
        {
          "date": null,
          "entityId": "f7172658-f81a-4e4b-9721-aa5ca2c79e72",
          "entityName": "Belvedere Calcagno",
          "imagePath": "/Media/POI/primary-f7172658-f81a-4e4b-9721-aa5ca2c79e72.webp",
          "badgeText": "Belvedere",
          "address": ""
        }
      ],
      "id": 410,
      "exception": null,
      "status": 5,
      "isCanceled": false,
      "isCompleted": true,
      "isCompletedSuccessfully": true,
      "creationOptions": 0,
      "asyncState": null,
      "isFaulted": false
    }
  }
}]);