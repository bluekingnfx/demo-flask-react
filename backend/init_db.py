
import sqlite3 as sql


def initiate_db():
    con = sql.connect("./iris.db")
    cursor = con.cursor()

    #if you need a fresh db
    #cursor.execute("""
    #    DROP TABLE IF EXISTS iris
    #""")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS iris(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sepalWidth REAL,
            petalWidth REAL,
            sepalHeight REAL,
            petalHeight REAL,
            species TEXT
        )
    """)


    con.commit()
    con.close()

if __name__ == "__main__":
    initiate_db()