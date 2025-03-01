import fs from "fs";
import path from "path";

/**
 * Command to generate templates for migrations, models, or seeders.
 */
export class GenerateTemplateCommand {
  /**
   * Generates a template for migrations, models, or seeders.
   * @param type - The type of template (migration, model, seeder).
   * @param name - The name of the template.
   * @param table - The name of the table (only for seeders).
   */
  async execute(type: string, name: string, table?: string): Promise<void> {
    const template = await this.getTemplate(type, name, table);
    const projectDir = process.cwd();
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const dirPath = path.join(projectDir, "src", `${capitalizedType}s`);
    const filePath = path.join(dirPath, `${name}.ts`);

    // Create the directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });

    // Write the generated template to the filesystem
    fs.writeFileSync(filePath, template.trim());
    console.log(`${capitalizedType} ${name} created in ${dirPath}.`);
  }

  /**
   * Returns the appropriate template based on the type.
   * @param type - The type of template.
   * @param name - The name of the template.
   * @param table - The name of the table (only for seeders).
   */
  private async getTemplate(
    type: string,
    name: string,
    table?: string
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      "../Commands/templates",
      `${type}.tpl`
    );
    let template = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders in the template
    template = template.replace(/{{name}}/g, name);
    if (table) {
      template = template.replace(/{{table}}/g, table);
    }

    return template;
  }
}
