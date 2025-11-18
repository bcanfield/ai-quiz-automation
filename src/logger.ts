import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Logger adapter for prettier terminal output
 * Uses chalk for colors and boxen for styled boxes
 */
class Logger {
    /**
     * Starting message with a box
     */
    start(message: string): void {
        console.log('\n' + boxen(chalk.bold.cyan(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan'
        }));
    }

    /**
     * Section header (e.g., "--- Question N ---")
     */
    section(title: string): void {
        console.log('\n' + chalk.bold.yellow('─'.repeat(50)));
        console.log(chalk.bold.yellow(title));
        console.log(chalk.bold.yellow('─'.repeat(50)));
    }

    /**
     * Connection/initialization message
     */
    connected(message: string): void {
        console.log(chalk.green('✓'), chalk.cyan(message));
    }

    /**
     * Extraction/processing message
     */
    extracting(message: string): void {
        console.log(chalk.blue('→'), message);
    }

    /**
     * General info message
     */
    info(message: string): void {
        console.log(chalk.cyan(message));
    }

    /**
     * Question text display
     */
    question(text: string): void {
        console.log('\n' + chalk.bold.white('Question:'), chalk.white(text));
    }

    /**
     * AI analysis message with brain emoji
     */
    analyzing(message: string): void {
        console.log('\n' + chalk.magenta.bold('🧠 ' + message));
    }

    /**
     * Success message with checkmark
     */
    success(message: string): void {
        console.log(chalk.green('   ✅ ' + message));
    }

    /**
     * Iteration progress
     */
    iteration(current: number, total: number): void {
        console.log('\n' + chalk.blue(`🔄 Iteration ${current}/${total}`));
    }

    /**
     * Score/constraint info
     */
    detail(message: string): void {
        console.log(chalk.gray('   ' + message));
    }

    /**
     * Warning message
     */
    warning(message: string): void {
        console.log('\n' + chalk.yellow('⚠️  ' + message));
    }

    /**
     * Error message
     */
    error(message: string, details?: any): void {
        console.log('\n' + chalk.red.bold('❌ ' + message));
        if (details) {
            console.error(chalk.red('   Details:'), details);
        }
    }

    /**
     * Error with cause and text (for AI errors)
     */
    errorWithDetails(message: string, cause?: any, text?: string): void {
        console.log('\n' + chalk.red.bold('❌ ' + message));
        if (cause) {
            console.error(chalk.red('   Cause:'), cause);
        }
        if (text) {
            console.error(chalk.red('   Text:'), text);
        }
    }

    /**
     * AI selection announcement
     */
    aiSelection(count: number): void {
        const msg = count === 1 ? '1 answer' : `${count} answers`;
        console.log(chalk.bold.magenta(`🎯 AI selected ${msg}:`));
    }

    /**
     * Selected answer
     */
    answer(index: number, text: string): void {
        console.log(chalk.green.bold(`  ✓ [${index}]`), chalk.white(text));
    }

    /**
     * AI reasoning with better formatting
     */
    reasoning(text: string): void {
        console.log(chalk.bold.cyan('💭 Reasoning:'));
        // Split long reasoning into paragraphs for better readability
        const lines = text.split('\n').filter(line => line.trim());
        lines.forEach(line => {
            console.log(chalk.dim('   ' + line.trim()));
        });
    }

    /**
     * Action taken (clicked, etc.)
     */
    action(message: string): void {
        console.log(chalk.cyan('→'), message);
    }

    /**
     * Completion message
     */
    complete(message: string): void {
        console.log('\n' + boxen(chalk.bold.green(message), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
        }));
    }

    /**
     * Indented message (for sub-items)
     */
    indent(message: string): void {
        console.log(chalk.gray('   ' + message));
    }

    /**
     * Sources info
     */
    sources(count: number): void {
        console.log(chalk.blue(`   📚 ${count} sources retrieved`));
    }

    /**
     * Score display
     */
    score(score: number, maxScore: number): void {
        const color = score >= 95 ? chalk.green : score >= 80 ? chalk.yellow : chalk.red;
        console.log(color(`   Score: ${score}/${maxScore}`));
    }

    /**
     * Constraints check
     */
    constraints(passed: boolean): void {
        console.log(passed
            ? chalk.green('   Constraints: ✅ Pass')
            : chalk.red('   Constraints: ❌ Fail')
        );
    }

    /**
     * New line
     */
    newline(): void {
        console.log();
    }
}

// Export singleton instance
export const logger = new Logger();
