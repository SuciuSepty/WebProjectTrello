# WebProjectTrello
In acest proiect vreau sa fac un Trello care m-ar ajuta pe mine, pentru mini bussiness-ul pe care-l am, de exemplu la final as vrea sa fie un trello, care are feature-urile pe care le vreau eu, precum: 
# Informatii
- Comentariile pe care le-am facut in Faza Intai A acestui proiect sa fie relevante, eu am gandit ca avem un "Proiect" sau na, pentru mini business-ul meu ar fi o Sectiune a ceea ce am nevoie, in care putem pune task-uri, si subtask-uri (in comentarii) pe care le putem face de parca le-am termina, sau "sterge", de parca n-ar fi contat.
- Vreau sa fie colaborativ, real time update (precum si cat se poate cu resursele necesare)
# FrameWorks:
- HTML (Ce tine tot impreuna)
- CSS (Design)
- JS (pentru animatii, pop-uri, emoji.)
# Ce FrameWorks ar mai putea veni intre timp
- Socket.IO (Pentru ca User-ul 1 cand scrie ceva sa vada si user B)
- Node.js (Salvare pentru refresh, API creation, database save) + Express (ma ajuta pentru a scrie cod mai putin)
# WorkFlw Complet
- User-ul adauga un task (frontend JS)
- Trimite request la server (Express)
- Server salveaza (DB)
- Server-ul trimite update prin Socket
- Toti vad instant modificarea
# Probleme posibile
- Asta va necesita cel mai probabil optimizare (Modificarea instantanee si vizualizarea tuturor, in cazul scalabilitatii).
# Posibile imbunatatiri 
- Firebase pentru inlocuirea Node.js Express si Socket, oferindu-mi ce am nevoie. 