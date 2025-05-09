import { DialogService } from "../services";

export const POP_UP = {
    showMessage(dialogservice: DialogService, title: string, content: string | string[]): void {
      if (Array.isArray(content))
      {
        content = content.join('\n');
      }

      const modelOption = {
          modelName: 'send-password',
          config: {
            data: {
              title: title,
              text: content,
              displayFooter: true,
              confirmButton: '確定',
            },
            width: '500px',
            maxHeight: '90vh',
            hasBackdrop: true,
            autoFocus: false,
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            panelClass: '',
          },
        };
        dialogservice.openLazyDialog(
          modelOption.modelName,
          modelOption.config
        );
    }
}