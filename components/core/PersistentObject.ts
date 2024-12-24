export class PersistentObject<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  path: string;
  data: T[];
  constructor(name: string) {
    this.id = crypto.randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.name = name;
    this.path = `${Deno.cwd()}/data/${this.name}.json`;
    this.data = [] as T[];
    this.init();
  }

  public async init() {
    await this.initFileStore();
    await this.readFromFile();
  }

  public async create(data: T) {
    this.data.unshift(data);
    await this.writeToFile();
  }

  public async createMany(data: T[]) {
    this.data = [...this.data, ...data];
    await this.writeToFile();
  }

  public read() {
    return this.data;
  }

  public async update(query: { [key: string]: string }, data: T) {
    this.data = this.data.map((item) => {
      for (const [key, value] of Object.entries(query)) {
        // @ts-ignore Making the compiler happy due to dynamic type
        if (item[key] === value) {
          return data;
        }
      }
      return item;
    });
    await this.writeToFile();
  }

  public async delete(query: { [key: string]: string }) {
    this.data = this.data.filter((item) => {
      for (const [key, value] of Object.entries(query)) {
        // @ts-ignore Making the compiler happy due to dynamic type
        return item[key] !== value;
      }
    });
    await this.writeToFile();
  }

  public async deleteMany(query?: { [key: string]: string }) {
    if (!query) {
      this.data = [];
    } else {
      this.data = this.data.filter((item) => {
        for (const [key, value] of Object.entries(query)) {
          // @ts-ignore Making the compiler happy due to dynamic type
          return item[key] !== value;
        }
      });
    }
    await this.writeToFile();
  }

  private async initFileStore() {
    try {
      await Deno.lstat(this.path);
    } catch (_error) {
      await Deno.writeTextFile(this.path, JSON.stringify([]));
    }
  }

  private async writeToFile() {
    const path = `${Deno.cwd()}/data/${this.name}.json`;
    await Deno.writeTextFile(path, JSON.stringify(this.data));
  }

  private async readFromFile() {
    const path = `${Deno.cwd()}/data/${this.name}.json`;
    this.data = JSON.parse(await Deno.readTextFile(path)) as T[];
  }
}
