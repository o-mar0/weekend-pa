class TasksController < ApplicationController
  before_action :find_task, only: %i[show edit destroy update]

  def index
    @tasks = Task.all.select { |task| task.user == current_user }
    @tasks_categories = {}
    @tasks.each do |task|
      next if task.status

      if @tasks_categories.include? task.category.label
        @tasks_categories[task.category.label].push(task)
      else
        @tasks_categories[task.category.label] = [task]
      end
    end
  end

  def create
    @task = Task.new(task_params)
    @task.user = current_user

    @task.category = params[:task][:category_id].nil? ? Category.find_by(name: 'appointment') : Category.find(params[:task][:category_id].to_i)

    if @task.save
      redirect_to tasks_path, notice: "Good work! You now have #{current_user.tasks.count} tasks to do.."
    else
      render 'pages/home'
    end
  end

  def update
    if @task.update(task_params)
      params[:task][:status] && params[:task][:status] == "1" ? @task.status = true : @task.status = false
      @task.save!
      respond_to do |format|
        format.html { redirect_to task_path(@task) }
        format.js { render 'tasks/update.js.erb' } # <-- will render `app/views/tasks/update_task.js.erb`
      end
    else
      render :edit
    end
  end

  def destroy
    # @task = Task.find(params[:id])
    @task.destroy
    redirect_to tasks_path
  end

  private

  def find_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :location, :start_at, :end_at, :due, :category)
  end
end
