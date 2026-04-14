const DEFAULT_BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const TOTAL_USERS = Number(process.env.TOTAL_USERS ?? "100");

const HISTORICAL_FIGURES = [
  ["Ada", "Lovelace"],
  ["Alan", "Turing"],
  ["Grace", "Hopper"],
  ["Katherine", "Johnson"],
  ["Rosalind", "Franklin"],
  ["Marie", "Curie"],
  ["Nikola", "Tesla"],
  ["Albert", "Einstein"],
  ["Isaac", "Newton"],
  ["Galileo", "Galilei"],
  ["Johannes", "Kepler"],
  ["Charles", "Darwin"],
  ["Gregor", "Mendel"],
  ["Louis", "Pasteur"],
  ["Florence", "Nightingale"],
  ["Srinivasa", "Ramanujan"],
  ["Carl", "Gauss"],
  ["Leonhard", "Euler"],
  ["Blaise", "Pascal"],
  ["René", "Descartes"],
  ["Socrates", "Athens"],
  ["Plato", "Academy"],
  ["Aristotle", "Lyceum"],
  ["Julius", "Caesar"],
  ["Augustus", "Caesar"],
  ["Cleopatra", "Philopator"],
  ["Alexander", "Macedon"],
  ["Leonidas", "Sparta"],
  ["Hannibal", "Barca"],
  ["Marcus", "Aurelius"],
  ["Joan", "Arc"],
  ["William", "Shakespeare"],
  ["Christopher", "Marlowe"],
  ["Miguel", "Cervantes"],
  ["Jane", "Austen"],
  ["Mary", "Shelley"],
  ["Charles", "Dickens"],
  ["Leo", "Tolstoy"],
  ["Fyodor", "Dostoevsky"],
  ["Victor", "Hugo"],
  ["Emily", "Dickinson"],
  ["Walt", "Whitman"],
  ["Edgar", "Poe"],
  ["Oscar", "Wilde"],
  ["Virginia", "Woolf"],
  ["George", "Orwell"],
  ["Frida", "Kahlo"],
  ["Leonardo", "DaVinci"],
  ["Michelangelo", "Buonarroti"],
  ["Raphael", "Sanzio"],
  ["Rembrandt", "Harmenszoon"],
  ["Vincent", "VanGogh"],
  ["Claude", "Monet"],
  ["Johann", "Bach"],
  ["Ludwig", "Beethoven"],
  ["Wolfgang", "Mozart"],
  ["Frederic", "Chopin"],
  ["Giuseppe", "Verdi"],
  ["Duke", "Ellington"],
  ["Louis", "Armstrong"],
  ["Billie", "Holiday"],
  ["Ella", "Fitzgerald"],
  ["Charlie", "Parker"],
  ["Bessie", "Smith"],
  ["Harriet", "Tubman"],
  ["Frederick", "Douglass"],
  ["Sojourner", "Truth"],
  ["Susan", "Anthony"],
  ["Emmeline", "Pankhurst"],
  ["Mahatma", "Gandhi"],
  ["Nelson", "Mandela"],
  ["Martin", "LutherKing"],
  ["Winston", "Churchill"],
  ["Abraham", "Lincoln"],
  ["Theodore", "Roosevelt"],
  ["Eleanor", "Roosevelt"],
  ["Franklin", "Roosevelt"],
  ["Amelia", "Earhart"],
  ["Sally", "Ride"],
  ["Yuri", "Gagarin"],
  ["Neil", "Armstrong"],
  ["Buzz", "Aldrin"],
  ["Valentina", "Tereshkova"],
  ["Pelé", "Nascimento"],
  ["Diego", "Maradona"],
  ["Muhammad", "Ali"],
  ["Babe", "Ruth"],
  ["Jesse", "Owens"],
  ["Jackie", "Robinson"],
  ["Bruce", "Lee"],
  ["Audrey", "Hepburn"],
  ["Charlie", "Chaplin"],
  ["Marilyn", "Monroe"],
  ["Elizabeth", "Taylor"],
  ["James", "Dean"],
  ["Ingrid", "Bergman"],
  ["Cary", "Grant"],
  ["Lucille", "Ball"],
  ["David", "Bowie"],
  ["Elvis", "Presley"],
  ["Aretha", "Franklin"],
  ["Johnny", "Cash"]
];

function normalizePart(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}

function buildUser(index) {
  const [firstName, lastName] = HISTORICAL_FIGURES[index % HISTORICAL_FIGURES.length];
  const emailFirst = normalizePart(firstName);
  const emailLast = normalizePart(lastName);
  const needsSuffix = index >= HISTORICAL_FIGURES.length;
  const suffix = needsSuffix ? `.${String(index + 1).padStart(3, "0")}` : "";

  return {
    email: `${emailFirst}.${emailLast}${suffix}@example.com`,
    firstName,
    lastName,
    status: index % 5 === 0 ? "inactive" : "active",
  };
}

async function createRootUser(baseUrl, user) {
  const response = await fetch(`${baseUrl}/v1/root-users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}: ${typeof payload === "string" ? payload : JSON.stringify(payload)}`,
    );
  }

  return payload;
}

async function main() {
  console.log(`Creating ${TOTAL_USERS} dummy root users at ${DEFAULT_BASE_URL}...`);

  let created = 0;
  let failed = 0;

  for (let index = 0; index < TOTAL_USERS; index += 1) {
    const user = buildUser(index);

    try {
      const result = await createRootUser(DEFAULT_BASE_URL, user);
      created += 1;
      console.log(
        `[${created}/${TOTAL_USERS}] created ${user.firstName} ${user.lastName} <${user.email}> -> ${result?.body?.rootUserId ?? "ok"}`,
      );
    } catch (error) {
      failed += 1;
      console.error(`[${index + 1}/${TOTAL_USERS}] failed ${user.firstName} ${user.lastName} <${user.email}>`);
      console.error(error instanceof Error ? error.message : String(error));
    }
  }

  console.log("");
  console.log(`Finished. Created: ${created}, Failed: ${failed}`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Seeder failed unexpectedly.");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
