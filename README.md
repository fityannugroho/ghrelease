## GitHub Release Viewer

[![screenshot](/public/og-image.png)](https://ghrelease.fityan.tech)

**GitHub Release page with better UX.** Read and discover release notes of any GitHub public repository with ease.

👉 **https://ghrelease.fityan.tech** 👈

## Tech stack

- Next.js 15 (app router) + React 19
- Tailwind CSS
- Shadcn UI
- Tanstack Query

## Installation

### Prerequisite

- Node.js 18 or higher
- pnpm

### Steps

- Clone this project
- Install the packages: `pnpm i`
- Run the development server: `pnpm dev`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

You can deploy this project using Vercel, Cloudflare, or any other hosting provider.

If you want to deploy this project on **Cloudflare Workers**, we have set up the configuration for you. Follow these steps:
- Create new Cloudflare KV namespace on your Cloudflare dashboard or this command:
  ```bash
  pnpm wrangler kv namespace create <YOUR_NAMESPACE_NAME>
  ```
- Then your KV namespace will be created. Copy the `id` and open the `wrangler.jsonc` file. Replace the `id` of `NEXT_INC_CACHE_KV` binding with your KV namespace id.
  ```json
  {
    "kv_namespaces": [
      {
        "binding": "NEXT_INC_CACHE_KV",
        "id": "<YOUR_NAMESPACE_ID_HERE>",
      }
    ]
  }
  ```
- Now you can deploy with this command:
  ```bash
  pnpm run deploy
  ```

## License

This project is licensed under the [MIT License](LICENSE).

## Support This Project

**Give a ⭐️** if this project helped you! Also please consider supporting this project by [**becoming a sponsor**](https://github.com/sponsors/fityannugroho).
