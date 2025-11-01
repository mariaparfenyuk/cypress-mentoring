// Минимальный пример на https://books.toscrape.com/
// Идея: (1) заходим на главную и сверяем title двумя способами,
//       (2) кликаем по нескольким категориям слева и проверяем, что title/h1 совпадают,
//       (3) возвращаемся "назад" и убеждаемся, что снова на главной.

describe('Books to Scrape navigation', () => {
  // сколько категорий проверяем (чтобы тест был быстрым)
  const TAKE_FIRST_N = 5;

  beforeEach(() => {
    cy.visit('https://books.toscrape.com/');

    // Сравниваем title двумя способами и сохраняем "домашний" title
    cy.title().then((titleA) => {
      cy.document().its('title').should('eq', titleA);
      cy.wrap(titleA).as('homeTitle');
    });

    // Боковое меню с категориями должно быть на месте
    cy.get('.nav-list', { timeout: 10000 }).should('be.visible');
  });

  it('кликает по первым категориям и проверяет заголовки', () => {
    // Берём список ссылок категорий
    cy.get('.nav-list > li > ul > li > a')
      .should('have.length.greaterThan', 0)
      .then(($links) => {
        // ограничим количество для наглядности
        const count = Math.min($links.length, TAKE_FIRST_N);

        for (let i = 0; i < count; i++) {
          // достанем текст категории (например, "Travel")
          const name = $links.eq(i).text().trim();

          // кликаем именно по этой категории (через повторный поиск по тексту — устойчиво)
          cy.contains('.nav-list a', new RegExp(`^\\s*${name}\\s*$`))
            .click();

          // Проверяем, что мы на странице категории:
          // <title> обычно содержит название категории,
          // а <h1> на странице равен названию категории
          cy.title().should('include', name);
          cy.get('h1').should('contain', name);

          // Возвращаемся на главную и убеждаемся по title, что вернулись
          cy.go('back');
          cy.get('@homeTitle').then((homeTitle) => {
            cy.title().should('eq', homeTitle);
          });
        }
      });
  });

  it('открывает карточку книги и возвращается назад', () => {
    // Клик по первой книге на главной
    cy.get('.product_pod h3 a').first().then(($a) => {
      const bookTitle = $a.attr('title') || $a.text().trim();
      cy.wrap($a).click();

      // Проверим, что в заголовке страницы и h1 есть название книги
      cy.title().should('include', bookTitle);
      cy.get('h1').should('contain', bookTitle);

      // Назад на главную
      cy.go('back');
      cy.get('@homeTitle').then((homeTitle) => {
        cy.title().should('eq', homeTitle);
      });
    });
  });
});
