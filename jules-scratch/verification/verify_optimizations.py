from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.wait_for_timeout(5000)  # 5 seconds delay
    page.goto("http://localhost:1313/posts/image-gallery-showcase/")

    html = page.content()
    print(html)

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
