//попробую сделать тесты на bbc.com

describe('Bbc navigation', () => {
  // Желательно использовать константы для селекторов, чтобы избежать дублирования кода
  const SIGN_IN_BTN = 'button[aria-label="Sign In"]';
  const REGISTER_BTN = 'button[aria-label="Register"]';
  
  // beforeEach выполняется перед каждым тестом: открываем главную страницу
  beforeEach(() => {
    cy.visit('https://www.bbc.com/');
  });

  it('Открытие главной страницы', () => {
    //cy.visit('https://www.bbc.com/')

    // Проверка заголовка главной страницы
    //cy.title().should('eq', 'BBC Home - Breaking News, World News, US News, Sports, Business, Innovation, Climate, Culture, Travel, Video & Audio')
    cy.title().should('include', 'BBC Home');
    //Для проверки заголовка лучше использовать include, так как он может меняться

    // Проверка наличия кнопок 'Sign in' 'Register'
   // cy.contains('button',{ timeout: 10000 } , 'Sign In') //не ищет
    //cy.contains('button', { timeout: 10000 }, 'Register') // не ищет


    // Проверяем, что кнопки существуют и видимы (иногда элементы подгружаются с задержкой, нежелательно использовать конкретные таймауты)

    cy.get(SIGN_IN_BTN).should('exist').and('be.visible');
    cy.get(REGISTER_BTN).should('exist').and('be.visible');
    //cy.get('button[aria-label="Register"]', { timeout: 10000 }).should('be.visible') // ок
    //cy.get('button[aria-label="Sign In"]', { timeout: 10000 }).should('be.visible') // ок
  })

  it('Есть логотип BBC', () => { // не получилось найти лого
    //Также для проверки логотипа можно использовать селектор по ссылке на главную страницу
    cy.get('a[href="https://www.bbc.com/"]').first().should('be.visible');

//       cy.get('svg[category="logo"][icon="bbc"]', { timeout: 10000 })
//       .should('have.class', 'sc-583246d7-0')
//       .should('have.class', 'sc-583246d7-0')
//       .and('be.visible')
    
 })

  it('переходит в раздел News', () => {
    /**
     * BBC в зависимости от устройства показывает разное меню:
     * - на десктопе верхние ссылки видны сразу,
     * - на мобильной версии спрятаны за кнопкой-«бургером».
     *
     * Ниже мы ищем эту кнопку по разным вариантам атрибутов.
     * `aria-label*="Menu"` — звёздочка (`*=`) значит «атрибут содержит подстроку "Menu"»,
     *     то есть подойдёт <button aria-label="Main menu">.
     * `aria-label*="More"` — подстраховка: на некоторых версиях BBC
     *     та же кнопка называется "More".
     * `data-testid="header-menu-button"` — служебный атрибут BBC, который тоже можно использовать.
     *
     * Запятая между селекторами = логическое «ИЛИ» (ищем любую из этих кнопок).
     *
     * { timeout: 10000 } — ждём до 10 секунд, пока элемент появится.
     *
     * .then($btns => {...}) — получаем найденные DOM-элементы как массив jQuery.
     * Если хотя бы один найден ($btns.length > 0), заворачиваем первый обратно в Cypress-обёртку (cy.wrap)
     * и кликаем по нему, чтобы раскрыть меню.
     * Если кнопки нет (десктоп-версия) — просто ничего не делаем.
     */
    cy.get(
      'button[aria-label*="Menu"], button[aria-label*="More"], button[data-testid="header-menu-button"]',
      { timeout: 10000 }
    ).then($btns => {
      if ($btns.length) {
        cy.wrap($btns[0]).click();
      }
    });

    // Теперь, когда меню открыто (или и так было открыто), ссылка "News" видна
    cy.get('a[href="/news"]', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Проверяем, что мы попали на страницу /news и что в заголовке есть "BBC News"
    cy.url().should('include', '/news');
    //Лучше использовать include, так как заголовок может меняться
    cy.title().should('include', 'BBC News');


    
    //cy.title().should('eq', 'BBC News - Breaking news, video and the latest top stories from the U.S. and around the world')
    //cy.visit('https://www.bbc.com/')
    //cy.contains('News').click() // не открывает
    //Можно сделать отдельный тест на проверку открытия новости из футера
    //cy.get('footer').contains('News').should('be.visible') // новости есть в фетере
    //cy.get('footer').contains('News').click() // клик

    //cy.url().should('include', '/news')

  })
})