import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { DateGroup, Match } from './draft5-scrapper.struct';

@Injectable()
export class Draft5ScrapperService implements OnModuleDestroy {
  private browser: puppeteer.Browser;

  private async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          // Flags para evitar problemas de execução em servidores sem interface gráfica
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--disable-gpu',
        ],
      });
    }
  }

  async getLatestNews(): Promise<string> {
    await this.initBrowser();
    const page = await this.browser.newPage();

    try {
      await page.goto('https://draft5.gg/equipe/330-FURIA', {
        waitUntil: 'networkidle2',
      });

      await page.waitForSelector('h2.TitleSingle__TitleContainer-sc-faqkks-0');

      const newsItems = await page.evaluate(() => {
        const newsHeader = Array.from(document.querySelectorAll('h2')).find(
          (h2) => h2?.textContent?.trim() === 'Notícias',
        );
        if (!newsHeader) return [];

        let parentContainer = newsHeader.parentElement;
        while (
          parentContainer &&
          !parentContainer.querySelector('.Card__CardContainer-sc-122kzjp-0')
        ) {
          parentContainer = parentContainer.parentElement;
        }
        if (!parentContainer) return [];

        const cards = parentContainer.querySelectorAll(
          '.Card__CardContainer-sc-122kzjp-0',
        );

        return Array.from(cards)
          .slice(0, 3)
          .map((card) => {
            const linkElement = card.querySelector('a');
            const link = linkElement?.href ?? '';
            const description =
              linkElement?.querySelector('p')?.textContent?.trim() ?? '';
            return { description, link };
          });
      });

      let message = '📰 *ÚLTIMAS NOTÍCIAS DA FURIA* 📰\n\n';
      newsItems.forEach((item) => {
        message += `📌 *${item.description}*\n`;
        message += `🌐 ${item.link}\n\n`;
      });

      return message.trim();
    } catch (error) {
      console.error('Erro ao coletar notícias:', error);
      await page.close();
      return 'Não foi possível obter as últimas notícias no momento.';
    }
  }

  async getLastResults(): Promise<string> {
    await this.initBrowser();
    const page = await this.browser.newPage();

    try {
      await page.goto('https://draft5.gg/equipe/330-FURIA/resultados', {
        waitUntil: 'networkidle2',
      });

      await page.waitForSelector(
        '.MatchCardSimple__MatchContainer-sc-wcmxha-0',
      );

      const matchResults = await this.extractMatchResults(page);
      return this.formatResultsMessage(matchResults);
    } catch (error) {
      console.error('Erro ao coletar resultados:', error);
      await page.close();
      return 'Não foi possível obter os últimos resultados no momento.';
    }
  }

  private async extractMatchResults(
    page: puppeteer.Page,
  ): Promise<DateGroup[]> {
    return page.evaluate(() => {
      const results: DateGroup[] = [];

      const dateElements = document.querySelectorAll<HTMLElement>(
        '.MatchList__MatchListDate-sc-1pio0qc-0',
      );
      const matchContainers = document.querySelectorAll(
        '.MatchCardSimple__MatchContainer-sc-wcmxha-0',
      );

      const extractMatchInfo = (container: Element) => {
        const teams = container.querySelectorAll(
          '.MatchCardSimple__MatchTeam-sc-wcmxha-11',
        );
        if (teams.length !== 2) return null;

        const team1 = teams[0].querySelector('span')?.textContent?.trim() ?? '';
        const score1 =
          teams[0]
            .querySelector('.MatchCardSimple__Score-sc-wcmxha-15')
            ?.textContent?.trim() ?? '0';

        const team2 = teams[1].querySelector('span')?.textContent?.trim() ?? '';
        const score2 =
          teams[1]
            .querySelector('.MatchCardSimple__Score-sc-wcmxha-15')
            ?.textContent?.trim() ?? '0';

        const tournament =
          container
            .querySelector('.MatchCardSimple__Tournament-sc-wcmxha-34')
            ?.textContent?.split('Reveja os lances')[0]
            ?.trim() ?? '';

        return { team1, score1, team2, score2, tournament };
      };

      const processMatchesForDate = (
        dateIndex: number,
        matchCounter: number,
      ) => {
        const currentDateText =
          dateElements[dateIndex]?.textContent?.trim() ?? '';
        const nextDateIndex = dateIndex + 1;
        const matches: Match[] = [];
        let newMatchCounter = matchCounter;

        for (
          let j = dateIndex;
          j < matchContainers.length &&
          matches.length < 3 &&
          newMatchCounter < 3;
          j++
        ) {
          const container = matchContainers[j];

          if (
            nextDateIndex < dateElements.length &&
            container.compareDocumentPosition(dateElements[nextDateIndex]) &
              Node.DOCUMENT_POSITION_PRECEDING
          ) {
            break;
          }

          const matchInfo = extractMatchInfo(container);
          if (matchInfo) {
            matches.push(matchInfo);
            newMatchCounter++;
          }
        }

        if (matches.length > 0) {
          results.push({
            date: currentDateText,
            matches,
          });
        }

        return newMatchCounter;
      };

      let matchCounter = 0;

      for (let i = 0; i < dateElements.length && matchCounter < 3; i++) {
        matchCounter = processMatchesForDate(i, matchCounter);
        if (matchCounter >= 3) break;
      }

      return results.slice(0, 3);
    });
  }

  private formatResultsMessage(matchResults: DateGroup[]): string {
    let message =
      '📊 *ÚLTIMOS RESULTADOS DA FURIA* 📊\nInformações retiradas do site DRAFT5\n\n';

    matchResults.forEach((dateGroup: DateGroup) => {
      message += `${dateGroup.date}\n`;

      dateGroup.matches.forEach((match: Match) => {
        const team1 = match.team1 === 'FURIA' ? '*FURIA*' : match.team1;
        const team2 = match.team2 === 'FURIA' ? '*FURIA*' : match.team2;
        const winner = this.determineWinner(match);

        message += `⚔️ ${team1} ${match.score1} x ${match.score2} ${team2}\n`;
        message += `🏆 Vencedor: ${winner} - ${match.tournament}\n\n`;
      });
    });

    return message.trim();
  }

  private determineWinner(match: Match): string {
    const score1 = parseInt(match.score1.trim());
    const score2 = parseInt(match.score2.trim());

    if (score1 > score2) {
      return match.team1;
    } else if (score2 > score1) {
      return match.team2;
    } else {
      return 'Empate';
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
