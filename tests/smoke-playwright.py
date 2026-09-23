from pathlib import Path
import os
import shutil
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'index.html').as_uri()
CHROMIUM = os.getenv('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser') or shutil.which('google-chrome')


def click_first_option(page):
    page.locator('[data-step-container] input').first.check()
    page.locator('[data-calc-next]').click()


def run():
    with sync_playwright() as p:
        launch_options = {'headless': True, 'args': ['--no-sandbox', '--disable-dev-shm-usage']}
        if CHROMIUM:
            launch_options['executable_path'] = CHROMIUM
        browser = p.chromium.launch(**launch_options)

        for viewport in [{'width': 1440, 'height': 1000}, {'width': 768, 'height': 1024}, {'width': 390, 'height': 844}]:
            page = browser.new_page(viewport=viewport)
            console_errors = []
            page.on('console', lambda msg: console_errors.append(msg.text) if msg.type in ['error', 'warning'] else None)
            page.on('pageerror', lambda err: console_errors.append(str(err)))
            page.goto(URL, wait_until='load')

            assert page.title(), 'Page title is empty'
            assert page.locator('h1').count() == 1, 'Page should have exactly one h1'
            assert page.locator('[data-cases-grid] .case-card').count() == 9, 'All 9 cases should render'
            assert page.locator('[data-open-case="velora"]').count() == 1, 'VELORA case should render'
            expect(page.locator('[data-cases-grid]')).to_contain_text('VELORA')
            expect(page.locator('[data-open-case="mos-reg-guide"]')).to_have_count(1)
            expect(page.locator('article[aria-labelledby="case-title-mos-reg-guide"] img')).to_have_attribute('src', 'cases-img/mos-reg-guide.png')
            assert page.locator('[data-open-case="razor-premium"]').count() == 1, 'Razor case should render'
            expect(page.locator('[data-cases-grid]')).to_contain_text('RAZOR / 01')
            expect(page.locator('#hero .btn').first).to_have_attribute('href', '#mini-audit')
            expect(page.locator('#landing-blocks')).to_be_visible()
            expect(page.locator('#channels')).to_be_visible()
            assert page.locator('a[href="https://t.me/garun_web"]').count() >= 1, 'Telegram direct link should be present'
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'Page has horizontal overflow'
            assert console_errors == [], f'Console/page errors: {console_errors}'
            page.close()

        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.goto(URL, wait_until='load')

        # Mobile menu
        page.locator('[data-menu-toggle]').click()
        expect(page.locator('[data-mobile-menu]')).to_be_visible()
        assert page.locator('[data-menu-toggle]').get_attribute('aria-expanded') == 'true'
        page.locator('[data-mobile-menu] a[href="#cases"]').click()
        expect(page.locator('[data-mobile-menu]')).to_be_hidden()
        assert page.locator('[data-menu-toggle]').get_attribute('aria-expanded') == 'false'

        # Case modal and CTA prefill
        page.locator('[data-open-case]').first.click()
        expect(page.locator('[data-case-modal]')).to_be_visible()
        expect(page.locator('#case-modal-title')).to_contain_text('Как был собран')
        expect(page.locator('[data-modal-content]')).to_contain_text('Функциональность')
        page.keyboard.press('Escape')
        expect(page.locator('[data-case-modal]')).to_be_hidden()
        page.locator('[data-case-lead]').first.click()
        expect(page.locator('[data-lead-context]')).to_contain_text('VELORA')

        page.locator('[data-open-case="mos-reg-guide"]').click()
        expect(page.locator('[data-modal-content]')).to_contain_text('Вкладки сценариев')
        expect(page.locator('[data-modal-content]')).to_contain_text('Отдельный маршрут для иностранных граждан')
        page.keyboard.press('Escape')

        # FAQ accordion
        second_faq = page.locator('.faq-item button').nth(1)
        second_faq.click()
        assert second_faq.get_attribute('aria-expanded') == 'true'

        # Calculator: validation, steps, result, demo submit
        page.locator('#calculator').scroll_into_view_if_needed()
        page.locator('[data-calc-next]').click()
        expect(page.locator('[data-calc-error]')).to_contain_text('Выберите')
        for _ in range(6):
            click_first_option(page)
        page.locator('input[name="calc_name"]').fill('Тест')
        page.locator('input[name="calc_contact"]').fill('@test')
        page.locator('input[name="calc_consent"]').check()
        page.locator('[data-calc-next]').click()
        expect(page.locator('.calc-result')).to_contain_text('предварительный расчёт')
        page.locator('[data-calc-next]').click()
        expect(page.locator('[data-calc-error]')).to_contain_text('Демо-режим')

        # Lead form validation and demo submit
        page.locator('#lead').scroll_into_view_if_needed()
        page.locator('.lead-form button[type="submit"]').click()
        expect(page.locator('.lead-form .form-status')).to_contain_text('Проверьте форму')
        page.locator('.lead-form input[name="name"]').fill('Тест')
        page.locator('.lead-form input[name="contact"]').fill('@test')
        page.locator('.lead-form input[name="consent"]').check()
        page.locator('.lead-form button[type="submit"]').click()
        expect(page.locator('.lead-form .form-status')).to_contain_text('Демо-режим')

        # Privacy page opens locally
        privacy = browser.new_page(viewport={'width': 1024, 'height': 768})
        privacy.goto((ROOT / 'privacy.html').as_uri(), wait_until='load')
        assert 'Политика' in privacy.title()
        assert privacy.locator('h1').count() == 1
        privacy.close()

        page.close()
        browser.close()


if __name__ == '__main__':
    run()
    print('Smoke tests passed')
